import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';

export class TnsolveFormInput implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'TN Solve Form Input',
		name: 'tnsolveFormInput',
		icon: 'file:tnsolve.svg',
		group: ['input'],
		version: 1,
		description: 'Collect form data for TN Solve video creation',
		defaults: {
			name: 'TN Solve Form Input',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				options: [
					{
						name: 'Collect Movie Data',
						value: 'collectMovieData',
						description: 'Collect data for Movie mode',
					},
					{
						name: 'Collect My Subject Data',
						value: 'collectMySubjectData',
						description: 'Collect data for My Subject mode (1 image required)',
					},
					{
						name: 'Collect Custom Character Data',
						value: 'collectCustomCharacterData',
						description: 'Collect data for Custom Character mode (2 images required)',
					},
					{
						name: 'Collect Custom Scenes Data',
						value: 'collectCustomScenesData',
						description: 'Collect data for Custom Scenes mode (dynamic images)',
					},
				],
				default: 'collectMovieData',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				placeholder: 'Enter video title',
				required: true,
			},
			{
				displayName: 'Script / Prompt',
				name: 'script',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				placeholder: 'Describe your video...',
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
			},
			{
				displayName: 'Duration',
				name: 'duration',
				type: 'options',
				options: [
					{ name: '00:08 (8s)', value: '1' },
					{ name: '00:16 (16s)', value: '2' },
					{ name: '00:24 (24s)', value: '3' },
					{ name: '00:32 (32s)', value: '4' },
					{ name: '00:40 (40s)', value: '5' },
					{ name: '00:48 (48s)', value: '6' },
					{ name: '00:56 (56s)', value: '7' },
					{ name: '01:04 (64s)', value: '8' },
					{ name: '01:36 (96s)', value: '12' },
					{ name: '02:08 (128s)', value: '16' },
					{ name: '02:40 (160s)', value: '20' },
					{ name: '03:12 (192s)', value: '24' },
					{ name: '03:44 (224s)', value: '28' },
					{ name: '04:16 (256s)', value: '32' },
					{ name: '04:48 (288s)', value: '36' },
					{ name: '05:20 (320s)', value: '40' },
				],
				default: '8',
				displayOptions: {
					show: {
						operation: ['collectMovieData'],
					},
				},
				required: true,
			},
			{
				displayName: 'Duration',
				name: 'duration',
				type: 'options',
				options: [
					{ name: '00:08 (8s)', value: '1' },
					{ name: '00:16 (16s)', value: '2' },
					{ name: '00:24 (24s)', value: '3' },
					{ name: '00:32 (32s)', value: '4' },
					{ name: '00:40 (40s)', value: '5' },
					{ name: '00:48 (48s)', value: '6' },
					{ name: '00:56 (56s)', value: '7' },
					{ name: '01:04 (64s)', value: '8' },
				],
				default: '8',
				displayOptions: {
					show: {
						operation: ['collectMySubjectData', 'collectCustomCharacterData', 'collectCustomScenesData'],
					},
				},
				required: true,
			},
			{
				displayName: 'Subject Image URL',
				name: 'subjectImage',
				type: 'string',
				default: '',
				placeholder: 'https://storage.tnsolve.com/...',
				displayOptions: {
					show: {
						operation: ['collectMySubjectData'],
					},
				},
				required: true,
				description: 'Exactly 1 image URL required',
			},
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
						operation: ['collectCustomCharacterData'],
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
						operation: ['collectCustomCharacterData'],
					},
				},
				required: true,
				description: 'Exactly 2 comma-separated image URLs required',
			},
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
						operation: ['collectCustomScenesData'],
					},
				},
				required: true,
				description: 'Prompts for each scene, separated by | character. Number of scenes must match duration/8',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const operation = this.getNodeParameter('operation', 0) as string;
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const title = this.getNodeParameter('title', i) as string;
			const script = this.getNodeParameter('script', i) as string;
			const modelVideo = this.getNodeParameter('modelVideo', i) as string;
			const frameRate = this.getNodeParameter('frameRate', i) as string;
			const videoStyle = this.getNodeParameter('videoStyle', i) as string;
			const duration = this.getNodeParameter('duration', i) as string;

			const outputData: IDataObject = {
				title,
				value: script,
				modelVideo,
				frameRate,
				videoStyle,
				videoDuration: duration,
			};

			if (operation === 'collectMovieData') {
				outputData.videoMode = 'movie';
			} else if (operation === 'collectMySubjectData') {
				const subjectImage = this.getNodeParameter('subjectImage', i) as string;
				const imageUrls = subjectImage.split(',').map(url => url.trim()).filter(url => url);
				
				if (imageUrls.length !== 1) {
					throw new Error('Chủ thể của tôi requires exactly 1 image');
				}

				outputData.videoMode = 'my_subject';
				outputData.subjectImage = subjectImage.trim();
			} else if (operation === 'collectCustomCharacterData') {
				const characterPrompt = this.getNodeParameter('characterPrompt', i) as string;
				const characterImages = this.getNodeParameter('characterImages', i) as string;
				const imageUrls = characterImages.split(',').map(url => url.trim()).filter(url => url);
				
				if (imageUrls.length !== 2) {
					throw new Error('Nhân vật tùy chỉnh requires exactly 2 images');
				}

				outputData.videoMode = 'custom_character';
				outputData.characterPrompt = characterPrompt;
				outputData.characterImages = characterImages;
			} else if (operation === 'collectCustomScenesData') {
				const scenePrompts = this.getNodeParameter('scenePrompts', i) as string;
				const durationValue = parseInt(duration, 10);
				const durationInSeconds = durationValue * 8;
				const requiredScenes = durationValue;
				
				const scenes = scenePrompts.split('|').map(scene => scene.trim()).filter(scene => scene);
				
				if (scenes.length !== requiredScenes) {
					throw new Error(`Bối cảnh tùy chỉnh requires ${requiredScenes} scene prompts for ${durationInSeconds}s video`);
				}

				outputData.videoMode = 'custom_scenes';
				outputData.scenePrompts = scenePrompts;
			}

			returnData.push({ json: outputData });
		}

		return [returnData];
	}
}
