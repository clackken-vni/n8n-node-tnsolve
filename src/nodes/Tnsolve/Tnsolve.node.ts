import {
	ICredentialDataDecryptedObject,
	ICredentialsDecrypted,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';

interface VideoParams {
	title: string;
	value: string;
	modelVideo: string;
	frameRate: string;
	videoMode: string;
	videoStyle?: string;
	videoDuration: string;
	subjectImage?: string;
	characterImages?: string;
	characterPrompt?: string;
	sceneDescription?: string;
	characterDescription?: string;
	scenePrompts?: string;
}

export class Tnsolve implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'TN Solve Video',
		name: 'tnsolve',
		icon: 'file:tnsolve.svg',
		group: ['output'],
		version: 1,
		description: 'Create AI videos with TN Solve platform',
		defaults: {
			name: 'TN Solve Video',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'tnsolveApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				options: [
					{
						name: 'Create Video',
						value: 'createVideo',
						description: 'Create a new video',
					},
					{
						name: 'Upload Image',
						value: 'uploadImage',
						description: 'Upload an image to TN Solve',
					},
					{
						name: 'Get Video Status',
						value: 'getVideoStatus',
						description: 'Get the status of a video',
					},
					{
						name: 'List Videos',
						value: 'listVideos',
						description: 'List all videos',
					},
					{
						name: 'Get User Info',
						value: 'getUserInfo',
						description: 'Get user information',
					},
				],
				default: 'createVideo',
			},
			// Video creation fields
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				placeholder: 'Enter video title',
				displayOptions: {
					show: {
						operation: ['createVideo'],
					},
				},
				required: true,
			},
			{
				displayName: 'Script / Prompt',
				name: 'value',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				placeholder: 'Describe your video...',
				displayOptions: {
					show: {
						operation: ['createVideo'],
					},
				},
				required: true,
			},
			{
				displayName: 'Video Mode',
				name: 'videoMode',
				type: 'options',
				options: [
					{ name: 'Làm phim (Movie)', value: 'movie' },
					{ name: 'Đồng bộ nhân vật', value: 'character_preservation' },
					{ name: 'Đồng bộ cảnh quay', value: 'scene_consistency' },
					{ name: 'Chủ thể của tôi', value: 'my_subject' },
					{ name: 'Nhân vật tùy chỉnh', value: 'custom_character' },
					{ name: 'Bối cảnh tùy chỉnh', value: 'custom_scenes' },
				],
				default: 'movie',
				displayOptions: {
					show: {
						operation: ['createVideo'],
					},
				},
				required: true,
			},
			{
				displayName: 'Model',
				name: 'modelVideo',
				type: 'options',
				options: [
					{ name: 'Free - Fast (veo3_fast_lower)', value: 'veo3_fast_lower' },
					{ name: 'Standard (veo3_fast)', value: 'veo3_fast' },
					{ name: 'Pro (tn_solve_1)', value: 'tn_solve_1' },
				],
				default: 'veo3_fast_lower',
				displayOptions: {
					show: {
						operation: ['createVideo'],
					},
				},
				required: true,
			},
			{
				displayName: 'Frame Rate',
				name: 'frameRate',
				type: 'options',
				options: [
					{ name: 'Horizontal (16:9)', value: 'horizontal' },
					{ name: 'Vertical (9:16)', value: 'vertical' },
				],
				default: 'horizontal',
				displayOptions: {
					show: {
						operation: ['createVideo'],
					},
				},
				required: true,
			},
			{
				displayName: 'Video Style',
				name: 'videoStyle',
				type: 'options',
				options: [
					{ name: 'Default', value: 'general' },
					{ name: 'Cinematic', value: 'cinematic' },
					{ name: 'Animation', value: 'animation' },
					{ name: 'Storytelling', value: 'storytelling' },
					{ name: 'Documentary', value: 'documentary' },
					{ name: 'Advertising', value: 'advertising' },
					{ name: 'News', value: 'news' },
					{ name: 'Educational', value: 'educational' },
				],
				default: 'general',
				displayOptions: {
					show: {
						operation: ['createVideo'],
					},
				},
			},
			{
				displayName: 'Duration',
				name: 'videoDuration',
				type: 'options',
				options: [
					{ name: '00:08 (8s)', value: '1' },
					{ name: '00:16 (16s)', value: '2' },
					{ name: '00:24 (24s)', value: '3' },
					{ name: '00:32 (32s)', value: '4' },
					{ name: '00:40 (40s)', value: '5' },
					{ name: '01:04 (64s)', value: '8' },
					{ name: '02:08 (128s)', value: '16' },
					{ name: '04:00 (240s)', value: '30' },
					{ name: '08:00 (480s)', value: '60' },
				],
				default: '1',
				displayOptions: {
					show: {
						operation: ['createVideo'],
					},
				},
				required: true,
			},
			// my_subject fields
			{
				displayName: 'Subject Image URL',
				name: 'subjectImage',
				type: 'string',
				default: '',
				placeholder: 'https://storage.tnsolve.com/...',
				displayOptions: {
					show: {
						operation: ['createVideo'],
						videoMode: ['my_subject'],
					},
				},
				required: true,
			},
			// custom_character fields
			{
				displayName: 'Character Prompt',
				name: 'characterPrompt',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				placeholder: 'Describe your custom character...',
				displayOptions: {
					show: {
						operation: ['createVideo'],
						videoMode: ['custom_character'],
					},
				},
				required: true,
			},
			{
				displayName: 'Character Images URLs',
				name: 'characterImages',
				type: 'string',
				default: '',
				placeholder: 'https://storage.tnsolve.com/img1.jpg,https://storage.tnsolve.com/img2.jpg',
				displayOptions: {
					show: {
						operation: ['createVideo'],
						videoMode: ['custom_character'],
					},
				},
				description: 'Comma-separated URLs of character reference images',
			},
			// character_preservation fields
			{
				displayName: 'Character Description',
				name: 'characterDescription',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				placeholder: 'Describe the character to maintain consistency...',
				displayOptions: {
					show: {
						operation: ['createVideo'],
						videoMode: ['character_preservation'],
					},
				},
				required: true,
			},
			// scene_consistency fields
			{
				displayName: 'Scene Description',
				name: 'sceneDescription',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				placeholder: 'Describe the scene to maintain consistency...',
				displayOptions: {
					show: {
						operation: ['createVideo'],
						videoMode: ['scene_consistency'],
					},
				},
				required: true,
			},
			// custom_scenes fields
			{
				displayName: 'Scene Prompts',
				name: 'scenePrompts',
				type: 'string',
				typeOptions: {
					rows: 6,
				},
				default: '',
				placeholder: 'Scene 1 description | Scene 2 description | Scene 3 description...',
				displayOptions: {
					show: {
						operation: ['createVideo'],
						videoMode: ['custom_scenes'],
					},
				},
				description: 'Prompts for each scene, separated by | character',
				required: true,
			},
			// Upload image fields
			{
				displayName: 'Binary Property',
				name: 'binaryPropertyName',
				type: 'string',
				default: 'data',
				displayOptions: {
					show: {
						operation: ['uploadImage'],
					},
				},
				placeholder: 'data',
				description: 'Name of the binary property containing the image file',
			},
			// Get status fields
			{
				displayName: 'Video ID',
				name: 'videoId',
				type: 'string',
				default: '',
				placeholder: 'Enter video ID',
				displayOptions: {
					show: {
						operation: ['getVideoStatus'],
					},
				},
				required: true,
			},
		],
	};

		async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const operation = this.getNodeParameter('operation', 0) as string;
		const credentials = await this.getCredentials('tnsolveApi');
		const accessToken = credentials.accessToken as string;
		const csrfToken = credentials.csrfToken as string;

		const baseHeaders = {
			Authorization: `Bearer ${accessToken}`,
			'X-CSRF-Token': csrfToken,
			Origin: 'https://tnsolve.com',
			Referer: 'https://tnsolve.com/',
		};

		let result: INodeExecutionData = { json: {} };

		try {
			if (operation === 'createVideo') {
				const title = this.getNodeParameter('title', 0) as string;
				const value = this.getNodeParameter('value', 0) as string;
				const videoMode = this.getNodeParameter('videoMode', 0) as string;
				const modelVideo = this.getNodeParameter('modelVideo', 0) as string;
				const frameRate = this.getNodeParameter('frameRate', 0) as string;
				const videoStyle = this.getNodeParameter('videoStyle', 0) as string;
				const videoDuration = this.getNodeParameter('videoDuration', 0) as string;

				const params: VideoParams = {
					title,
					value,
					videoMode,
					modelVideo,
					frameRate,
					videoStyle,
					videoDuration,
				};

				// Add mode-specific parameters
				if (videoMode === 'my_subject') {
					params.subjectImage = this.getNodeParameter('subjectImage', 0) as string;
				} else if (videoMode === 'custom_character') {
					params.characterPrompt = this.getNodeParameter('characterPrompt', 0) as string;
					params.characterImages = this.getNodeParameter('characterImages', 0) as string;
				} else if (videoMode === 'character_preservation') {
					params.characterDescription = this.getNodeParameter('characterDescription', 0) as string;
				} else if (videoMode === 'scene_consistency') {
					params.sceneDescription = this.getNodeParameter('sceneDescription', 0) as string;
				} else if (videoMode === 'custom_scenes') {
					params.scenePrompts = this.getNodeParameter('scenePrompts', 0) as string;
				}

				// Create FormData
				const formData = new FormData();
				formData.append('title', params.title);
				formData.append('value', params.value);
				formData.append('modelVideo', params.modelVideo);
				formData.append('frameRate', params.frameRate);
				formData.append('videoMode', params.videoMode);
				formData.append('videoStyle', params.videoStyle || 'general');
				formData.append('videoDuration', params.videoDuration);

				if (params.subjectImage) formData.append('subjectImage', params.subjectImage);
				if (params.characterPrompt) formData.append('characterPrompt', params.characterPrompt);
				if (params.characterImages) formData.append('characterImages', params.characterImages);
				if (params.characterDescription) formData.append('characterDescription', params.characterDescription);
				if (params.sceneDescription) formData.append('sceneDescription', params.sceneDescription);
				if (params.scenePrompts) formData.append('scenePrompts', params.scenePrompts);

				const response = await fetch('https://api.tnsolve.com/api/products/video-automation', {
					method: 'POST',
					headers: baseHeaders,
					body: formData,
				});

				if (!response.ok) {
					throw new Error(`API error: ${response.statusText}`);
				}

				const data = await response.json();
				result = { json: data as IDataObject };

			} else if (operation === 'uploadImage') {
				const items = this.getInputData();
				const binaryPropertyName = this.getNodeParameter('binaryPropertyName', 0) as string;

				const uploadResults: INodeExecutionData[] = [];

				for (let i = 0; i < items.length; i++) {
					const item = items[i];
					if (item.binary && item.binary[binaryPropertyName]) {
						const binaryData = item.binary[binaryPropertyName];
						const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

						const formData = new FormData();
						formData.append('file', new Blob([buffer]), binaryData.fileName || 'image.jpg');

						const response = await fetch('https://api.tnsolve.com/api/upload/image', {
							method: 'POST',
							headers: baseHeaders,
							body: formData,
						});

						if (!response.ok) {
							throw new Error(`Upload failed: ${response.statusText}`);
						}

						const data = await response.json();
						uploadResults.push({ json: data as IDataObject });
					}
				}

				return [uploadResults];

			} else if (operation === 'getVideoStatus') {
				const videoId = this.getNodeParameter('videoId', 0) as string;

				const response = await fetch(
					`https://api.tnsolve.com/api/products/detail?_id=${videoId}`,
					{
						method: 'GET',
						headers: baseHeaders,
					}
				);

				if (!response.ok) {
					throw new Error(`API error: ${response.statusText}`);
				}

				const data = await response.json();
				result = { json: data as IDataObject };

			} else if (operation === 'listVideos') {
				const response = await fetch('https://api.tnsolve.com/api/videos', {
					method: 'GET',
					headers: baseHeaders,
				});

				if (!response.ok) {
					throw new Error(`API error: ${response.statusText}`);
				}

				const data = await response.json();
				result = { json: data as IDataObject };

			} else if (operation === 'getUserInfo') {
				const response = await fetch('https://api.tnsolve.com/api/accounts/me', {
					method: 'GET',
					headers: baseHeaders,
				});

				if (!response.ok) {
					throw new Error(`API error: ${response.statusText}`);
				}

				const data = await response.json();
				result = { json: data as IDataObject };
			}
		} catch (error) {
			throw new Error(`TN Solve API error: ${(error as Error).message}`);
		}

		return [[result]];
	}
}
