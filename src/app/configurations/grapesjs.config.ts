import 'grapesjs-tailwind';
import { GrapesJsService } from '../services/grapesjs.service';
import grapesjs from 'grapesjs';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../environments/environtment.development';

export const GrapesjsConfig = (grapesjsService: GrapesJsService) => {
  const editor = grapesjs.init({
    container: '#gjs',
    plugins: [
      'grapesjs-tailwind',
      'grapesjs-preset-webpage',
      'grapesjs-plugin-forms',
      'grapesjs-blocks-basic',
    ],
    pluginsOpts: {
      'grapesjs-tailwind': {
        /* plugin options */
      },
      'grapesjs-preset-webpage': {},
      'grapesjs-plugin-forms': {},
      'grapesjs-blocks-basic': {},
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

  return editor; // Trả về đối tượng editor
};
