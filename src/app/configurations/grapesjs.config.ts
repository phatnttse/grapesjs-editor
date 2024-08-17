import 'grapesjs-tailwind';
import { GrapesJsService } from '../services/grapesjs.service';
import grapesjs from 'grapesjs';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../environments/environtment.development';

export const GrapesjsConfig = (grapesjsService: GrapesJsService) => {
  const editor = grapesjs.init({
    container: '#gjs',
    plugins: ['grapesjs-tailwind'],
    pluginsOpts: {
      'grapesjs-tailwind': {
        /* plugin options */
      },
    },
    fromElement: true,
    height: '100%',
    width: 'auto',
    storageManager: false,
    assetManager: {
      upload: `${environment.apiBaseUrl}/form/upload`,
      uploadFile: function (e: DragEvent | any) {
        debugger;
        var files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
        console.log(files);
        grapesjsService.uploadImage(files[0]).subscribe({
          next: (response: any) => {
            console.log(response);
            const am = editor.AssetManager;
            am.add(response); // Thêm tài sản vào Asset Manager
          },
          error: (error: HttpErrorResponse) => {
            console.log(error);
          },
        });
      },
      uploadName: 'file',
      autoAdd: true, // Tự động thêm ảnh vào danh sách sau khi tải lên
      assets: [], // Khởi tạo danh sách ảnh rỗng
    },
  });

  const blocks = [
    {
      id: 'section',
      label: 'Section',
      media: `<svg style="width:48px;height:48px" viewBox="0 0 24 24">
      <path fill="currentColor" d="M21,6V8H3V6H21M3,18H12V16H3V18M3,13H21V11H3V13Z"></path>
      </svg>`,
      content: `<section><h1>Section</h1></section>`,
      category: 'Layout',
    },
    {
      id: 'column',
      label: 'Column',
      media: ``,
      content: `<div class="column"><h2>Column</h2></div>`,
      category: 'Layout',
    },
    {
      id: 'text',
      label: 'Text',
      media: `<svg style="width:48px;height:48px" viewBox="0 0 24 24">
      <path fill="currentColor" d="M18.5,4L19.66,8.35L18.7,8.61C18.25,7.74 17.79,6.87 17.26,6.43C16.73,6 16.11,6 15.5,6H13V16.5C13,17 13,17.5 13.33,17.75C13.67,18 14.33,18 15,18V19H9V18C9.67,18 10.33,18 10.67,17.75C11,17.5 11,17 11,16.5V6H8.5C7.89,6 7.27,6 6.74,6.43C6.21,6.87 5.75,7.74 5.3,8.61L4.34,8.35L5.5,4H18.5Z" />
      </svg>`,
      content: '<p>Text Block</p>',
      category: 'Basic',
    },
    {
      id: 'image',
      label: 'Image',
      media: `<svg style="width:48px;height:48px" viewBox="0 0 24 24">
      <path fill="currentColor" d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z" />
      </svg>`,
      content: '<img src="http://placehold.it/350x250" alt="Image Block" />',
      category: 'Basic',
    },
    {
      id: 'link',
      label: 'Link',
      media: `<svg style="width:48px;height:48px" viewBox="0 0 24 24">
      <path fill="currentColor" d="M3.9,12C3.9,10.29 5.29,8.9 7,8.9H11V7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H11V15.1H7C5.29,15.1 3.9,13.71 3.9,12M8,13H16V11H8V13M17,7H13V8.9H17C18.71,8.9 20.1,10.29 20.1,12C20.1,13.71 18.71,15.1 17,15.1H13V17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7Z" />
      </svg>`,
      content: {
        type: 'link',
        content: '`<a href="#">Link Block</a>`',
        style: {
          color: 'blue',
        },
      },

      category: 'Basic',
    },
    {
      id: 'button',
      label: 'Button',
      meidia: `<svg style="width:48px;height:48px"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="button">  <path fill="white" d="M140 30L120 20L120 40Z" />`,
      content: `<button>Button Block</button>`,
      category: 'Basic',
    },
    {
      id: 'video',
      label: 'Video',
      media: `<svg style="width:48px;height:48px"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z"/></svg>`,
      content: {
        type: 'video',
        src: '', // Ban đầu để trống để người dùng chọn video từ AssetManager
      },
      activate: true,
      category: 'Media',
    },
    // Thêm các block khác theo nhu cầu
  ];

  // Thêm block vào Block Manager
  blocks.forEach((block) => {
    editor.BlockManager.add(block.id, {
      label: block.label,
      media: block.media,
      content: block.content,
      category: block.category,
      activate: block.activate,
    });
  });

  return editor; // Trả về đối tượng editor
};
