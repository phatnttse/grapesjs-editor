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
      'grapesjs-preset-newsletter',
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
      'grapesjs-preset-newsletter': {},
      'grapesjs-video-embed-manager': {
        resources: ['local'],
        localLoadUrl: `${environment.apiBaseUrl}/form/videos`,
        localLoadCallback: async function () {
          console.log('Local videos loaded');
        },
      },
    },
    fromElement: true,
    height: '100%',
    width: 'auto',
    storageManager: false,
    assetManager: {
      upload: `${environment.apiBaseUrl}/form/upload`,
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
      uploadName: 'file',
      autoAdd: true, // Tự động thêm ảnh vào danh sách sau khi tải lên
      assets: [], // Khởi tạo danh sách ảnh rỗng
    },
  });

  const panelManager = editor.Panels;
  panelManager.addButton('options', {
    id: 'upload-video',
    className: 'fa fa-video-camera',
    command: 'upload-video',
    attributes: { title: 'Upload Video' },
  });

  const updateVideoList = async () => {
    try {
      const videos = await fetchVideoList();
      editor.Panels.getPanel('options')?.trigger('change:video-list', videos);
    } catch (error) {
      console.error('Error updating video list:', error);
    }
  };

  editor.Commands.add('upload-video', {
    run(editor, sender) {
      dialog
        .open(VideoUploadComponent, {
          width: '800px',
          height: '100%',
        })
        .afterClosed()
        .subscribe(() => {
          updateVideoList(); // Cập nhật danh sách video sau khi thêm thành công
        });
    },
  });

  const fetchVideoList = async () => {
    try {
      const response = await fetch(`${environment.apiBaseUrl}/form/videos`);
      return response;
    } catch (error) {
      console.error('Error fetching videos:', error);
      return [];
    }
  };

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
