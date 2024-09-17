import 'grapesjs-tailwind';
import { GrapesJsService } from '../services/grapesjs.service';
import grapesjs from 'grapesjs';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../environments/environment.development';
import { ImageUpload } from '../models/image-upload';
import { MatDialog } from '@angular/material/dialog';
import { VideoUploadComponent } from '../components/dialogs/video-upload/video-upload.component';
import { AssetsManagerComponent } from '../components/dialogs/assets-manager/assets-manager.component';

export const GrapesjsConfig = (
  grapesjsService: GrapesJsService,
  dialog: MatDialog
) => {
  const editor = grapesjs.init({
    container: '#gjs',
    plugins: [
      // 'grapesjs-tailwind',
      'grapesjs-preset-webpage',
      // 'grapesjs-plugin-forms',
      'grapesjs-blocks-basic',
      'grapesjs-video-embed-manager',
      // 'grapesjs-navbar',
      // 'grapesjs-component-countdown',
      // 'grapesjs-style-gradient',
      // 'grapesjs-tabs',
      // 'grapesjs-style-bg',
      // 'grapesjs-blocks-flexbox',
      // 'grapesjs-preset-newsletter',
      // 'grapesjs-plugin-ckeditor',
      'grapesjs-tui-image-editor',
    ],
    pluginsOpts: {
      // 'grapesjs-tailwind': {},
      'grapesjs-preset-webpage': {
        blocks: [],
      },
      // 'grapesjs-plugin-forms': {},
      'grapesjs-blocks-basic': {},
      // 'grapesjs-navbar': {},
      // 'grapesjs-component-countdown': {},
      // 'grapesjs-style-gradient': {},
      // 'grapesjs-tabs': {},
      // 'grapesjs-style-bg': {},
      // 'grapesjs-blocks-flexbox': {},
      // 'grapesjs-preset-newsletter': {},
      // 'grapesjs-plugin-ckeditor': {},
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
          grapesjsService.Image_Upload(file).subscribe({
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
        localLoadUrl: `${environment.apiBaseUrl}/Grapesjs/Video_GetAll`,
      },
    },
    fromElement: true,
    height: '100%',
    width: 'auto',
    storageManager: false,
    jsInHtml: false,
    assetManager: {
      upload: `${environment.apiBaseUrl}/Grapesjs/upload-image`,
      uploadFile: function (e: DragEvent | any) {
        const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
        const file = files[0];
        grapesjsService.Image_Upload(file).subscribe({
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

  const panelManager = editor.Panels; // Lấy panel manager

  // Thêm button tải video lên vào panel options
  panelManager.addButton('options', {
    id: 'upload-video',
    className: 'fa-brands fa-youtube d-flex align-items-center',
    command: 'upload-video',
    attributes: { title: 'Upload Video' },
  });

  panelManager.addButton('options', {
    id: 'assets',
    className: 'fas fa-image d-flex align-items-center',
    command: 'assets',
    attributes: { title: 'Get Assets' },
  });

  editor.Commands.add('assets', {
    run() {
      dialog.open(AssetsManagerComponent, {
        width: '800px',
        height: 'auto',
      });
    },
  });

  // Hàm mở dialog tải video lên
  editor.Commands.add('upload-video', {
    run() {
      dialog.open(VideoUploadComponent, {
        width: '600px',
        height: 'auto',
      });
    },
  });

  // Thêm block button mở dialog
  editor.BlockManager.add('button-open-dialog', {
    label: 'Button Open Dialog',
    id: 'button-open-dialog',
    media:
      '<img src="https://res.cloudinary.com/dlpust9lj/image/upload/v1725467382/bgc8s6oym48uxwz3ngso.png" alt="Dialog with Button" style="width: 80px;"/>',
    content: {
      tagName: 'div',
      attributes: { class: 'edit-mode' },
      components: [
        {
          tagName: 'div',
          components: [
            {
              tagName: 'button',
              content: `
                  <img src="https://res.cloudinary.com/dlpust9lj/image/upload/v1725423588/ggrm7r0lsml8rk3kqvnd.svg" alt="Button Dialog" />
              `,
              attributes: {
                class: 'icon-item',
                id: `dialog-button-${Date.now()}`, // Generate unique ID once
              },
              script: function () {
                const btn = this as unknown as HTMLButtonElement;
                const baseId = btn.id.replace('dialog-button-', ''); // Extract base ID from button

                // Find corresponding dialog elements using the base ID
                const dialogOverlay = document.getElementById(
                  `dialog-${baseId}-overlay`
                ) as HTMLElement;
                const dialogContent = document.getElementById(
                  `dialog-${baseId}-content`
                ) as HTMLElement;
                const dialogBox = document.getElementById(
                  `dialog-${baseId}-box`
                ) as HTMLElement;

                btn.addEventListener('click', () => {
                  if (dialogOverlay && dialogContent && dialogBox) {
                    dialogOverlay.classList.remove('hidden');
                    dialogContent.classList.remove('hidden');
                    dialogBox.classList.remove('hidden');
                  }
                });

                if (dialogOverlay) {
                  dialogOverlay.addEventListener('click', () => {
                    dialogOverlay.classList.add('hidden');
                    dialogContent.classList.add('hidden');
                    dialogBox.classList.add('hidden');
                  });
                }
              },
            },
            {
              tagName: 'div',
              components: [
                {
                  tagName: 'div',
                  attributes: {
                    id: `dialog-${Date.now()}-overlay`, // Reuse the base ID for the overlay
                    class: 'dialog-overlay hidden',
                  },
                },
                {
                  tagName: 'div',
                  attributes: {
                    id: `dialog-${Date.now()}-content`, // Reuse the base ID for the content
                    class: 'dialog-content hidden',
                  },
                  components: [
                    {
                      tagName: 'div',
                      attributes: {
                        id: `dialog-${Date.now()}-box`, // Reuse the base ID for the dialog box
                        class: 'dialog-box hidden',
                      },
                      components: [
                        {
                          tagName: 'button',
                          content: '&times;',
                          attributes: {
                            class: 'dialog-close',
                            id: `dialog-${Date.now()}-close`, // Unique ID for the close button
                          },
                          script: function () {
                            const closeBtn =
                              this as unknown as HTMLButtonElement;
                            const baseId = closeBtn.id.replace('dialog-', ''); // Extract base ID from button

                            // Find corresponding dialog elements using the base ID
                            const dialogOverlay = document.getElementById(
                              `dialog-${baseId}-overlay`
                            ) as HTMLElement;
                            const dialogContent = document.getElementById(
                              `dialog-${baseId}-content`
                            ) as HTMLElement;
                            const dialogBox = document.getElementById(
                              `dialog-${baseId}-box`
                            ) as HTMLElement;

                            closeBtn.addEventListener('click', () => {
                              if (dialogOverlay && dialogContent && dialogBox) {
                                dialogOverlay.classList.add('hidden');
                                dialogContent.classList.add('hidden');
                                dialogBox.classList.add('hidden');
                              }
                            });
                          },
                        },
                        {
                          content: `<div class="wechat">
                            <div class="wechat-header">
                              <div>
                                <img
                                  src="https://res.cloudinary.com/dlpust9lj/image/upload/v1725423588/ggrm7r0lsml8rk3kqvnd.svg"
                                  alt=""
                                />
                              </div>
                            </div>
                            <div class="wechat-body">
                              <img
                                src="https://res.cloudinary.com/dlpust9lj/image/upload/v1724988103/csjcmqih0s2e1bm0bgxz.svg"
                                alt=""
                                id="iuz7g"
                                width="283"
                              />
                            </div>
                          </div>`,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    category: 'Templates',
  });

  // Tải block name-card-1 từ URL
  grapesjsService
    .Content_GetFromUrl('assets/grapesjs/blocks/html/name-card-1.html')
    .subscribe({
      next: (html: string) => {
        editor.BlockManager.add('name-card-1', {
          label: 'Name Card 1',
          media:
            '<img src="https://res.cloudinary.com/dlpust9lj/image/upload/v1726213844/cfpmqjuwln2vp3msczzg.png" alt="Business Card 1" style="width: 80px;border-radius: 10px; max-width:100%; height: auto;"/>',
          content: html,
          category: 'Name Cards',
        });
      },
      error: (error: HttpErrorResponse) => {
        console.log('Error loading name-card-1 block', error);
      },
    });

  // Tải block link kèm hình ảnh
  editor.BlockManager.add('link-image', {
    label: 'Link with image',
    media:
      '<img src="https://res.cloudinary.com/dlpust9lj/image/upload/v1724983528/uv7mmqvcts44fkxafche.svg"  style="width: 80px;border-radius: 10px; max-width:100%;"/>',
    content: `<a
              href="/"
              class="icon-item"
            >
              <img
                src=""
                alt="Link with image"
              />
            </a>`,
    category: 'Templates',
  });

  // Tải tất cả hình ảnh và lưu vào asset manager
  grapesjsService.Image_GetAll().subscribe({
    next: (response: any) => {
      const am = editor.AssetManager;
      am.add(response.items); // Thêm tất cả các tài sản vào Asset Manager
    },
    error: (error: HttpErrorResponse) => {
      console.log('Error loading assets', error);
    },
  });

  return editor; // Trả về đối tượng grapesjs editor
};
