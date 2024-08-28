import 'grapesjs-tailwind';
import { GrapesJsService } from '../services/grapesjs.service';
import grapesjs from 'grapesjs';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../environments/environment.development';
import { ImageUpload } from '../models/image-upload';
import { MatDialog } from '@angular/material/dialog';
import { VideoUploadComponent } from '../components/video-upload/video-upload.component';

export const GrapesjsConfig = (
  grapesjsService: GrapesJsService,
  dialog: MatDialog
) => {
  const editor = grapesjs.init({
    container: '#gjs',
    plugins: [
      'grapesjs-tailwind',
      'grapesjs-preset-webpage',
      'grapesjs-plugin-forms',
      'grapesjs-blocks-basic',
      'grapesjs-video-embed-manager',
      'grapesjs-navbar',
      'grapesjs-component-countdown',
      'grapesjs-style-gradient',
      'grapesjs-tabs',
      'grapesjs-style-bg',
      'grapesjs-blocks-flexbox',
      'grapesjs-touch',
      // 'grapesjs-preset-newsletter',
      'grapesjs-plugin-ckeditor',
      'grapesjs-tui-image-editor',
    ],
    pluginsOpts: {
      'grapesjs-tailwind': {
        /* plugin options */
      },
      'grapesjs-preset-webpage': {},
      'grapesjs-plugin-forms': {},
      'grapesjs-blocks-basic': {},
      'grapesjs-navbar': {},
      'grapesjs-component-countdown': {},
      'grapesjs-style-gradient': {},
      'grapesjs-tabs': {},
      'grapesjs-style-bg': {},
      'grapesjs-blocks-flexbox': {},
      // 'grapesjs-preset-newsletter': {},
      'grapesjs-plugin-ckeditor': {},
      'grapesjs-tui-image-editor': {
        config: {
          includeUI: {
            initMenu: 'filter',
          },
        },
        upload: `${environment.apiBaseUrl}/Grapesjs/upload`,
        uploadFile: function (e: DragEvent | any) {
          const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
          const file = files[0];
          grapesjsService.uploadImage(file).subscribe({
            next: (response: ImageUpload) => {
              const am = editor.AssetManager;
              am.add(response); // Thêm tài sản vào Asset Manager
            },
            error: (error: HttpErrorResponse) => {
              console.log(error);
            },
          });
        },
        autoAdd: true,
      },
      'grapesjs-video-embed-manager': {
        resources: ['local'],
        localLoadUrl: `${environment.apiBaseUrl}/Grapesjs/videos`,
      },
    },
    fromElement: true,
    height: '100%',
    width: 'auto',
    storageManager: false,
    assetManager: {
      upload: `${environment.apiBaseUrl}/Grapesjs/upload`,
      uploadFile: function (e: DragEvent | any) {
        const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
        const file = files[0];
        grapesjsService.uploadImage(file).subscribe({
          next: (response: ImageUpload) => {
            const am = editor.AssetManager;
            const asset = am.add(response); // Thêm tài sản vào Asset Manager

            // Áp dụng thay đổi ngay lập tức vào hình ảnh trong phần soạn thảo
            const selectedComponent = editor.getSelected();
            if (selectedComponent && selectedComponent.is('image')) {
              selectedComponent.set('src', asset.get('src'));
            }
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

  const panelManager = editor.Panels;
  panelManager.addButton('options', {
    id: 'upload-video',
    className: 'fa-brands fa-youtube d-flex align-items-center',
    command: 'upload-video',
    attributes: { title: 'Upload Video' },
  });
  editor.Commands.add('upload-video', {
    run() {
      dialog.open(VideoUploadComponent, {
        width: '800px',
        height: '100%',
      });
    },
  });
  editor.BlockManager.add('profile-block', {
    label: 'Profile Block',
    content: `
      <div class="relative w-full h-96 bg-center bg-cover flex items-center justify-center overflow-hidden">
        <!-- Name and Job Title -->
        <div class="absolute top-0 left-0 w-full flex flex-col items-center justify-center mt-4">
          <p class="text-lg font-bold text-white">Your Name</p>
          <p class="text-sm text-gray-200">Your Profession</p>
        </div>
        
        <!-- Avatar Container positioned half outside the background -->
        <div class="absolute bottom-0 flex flex-col items-center">
          <div class="relative w-48 h-48">
            <!-- Avatar Image -->
            <img src="path/to/your/avatar.jpg" class="w-full h-full rounded-full object-cover border-4 border-white shadow-xl" alt="Avatar">
            <!-- QR Code Badge -->
            <div class="absolute bottom-0 right-0 w-12 h-12 transform translate-x-1/2 translate-y-1/2">
              <img src="path/to/your/qrcode.png" class="w-full h-full rounded-full object-cover border-2 border-white shadow-md" alt="QR Code">
            </div>
          </div>
        </div>
      </div>
    `,
    category: 'Custom Blocks',
  });

  grapesjsService.getAssets().subscribe({
    next: (assets: ImageUpload[]) => {
      const am = editor.AssetManager;
      am.add(assets); // Thêm tất cả các tài sản vào Asset Manager
    },
    error: (error: HttpErrorResponse) => {
      console.log('Error loading assets', error);
    },
  });

  return editor; // Trả về đối tượng editor
};
