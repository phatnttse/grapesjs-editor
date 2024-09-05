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
          grapesjsService.uploadFile(file).subscribe({
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
    jsInHtml: false,
    assetManager: {
      upload: `${environment.apiBaseUrl}/Grapesjs/upload`,
      uploadFile: function (e: DragEvent | any) {
        const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
        const file = files[0];
        grapesjsService.uploadFile(file).subscribe({
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

  editor.BlockManager.add('dialog-with-button-block', {
    label: 'Dialog with Button',
    id: 'dialog-with-button-block',
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
                  <img src="./../../../assets/icons/icon-wechat.svg" alt="Website" />
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
                        class: `dialog-box hidden`,
                      },
                      components: [
                        {
                          tagName: 'h2',
                          content: 'Edit This Dialog',
                          attributes: {
                            class: 'dialog-title',
                          },
                        },
                        {
                          tagName: 'p',
                          content:
                            'Put your content here. You can edit this content directly in the GrapesJS editor.',
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
    category: 'Dialogs',
  });

  editor.BlockManager.add('we-chat-template', {
    label: 'WeChat Template',
    media:
      '<img src="https://res.cloudinary.com/dlpust9lj/image/upload/v1724983527/b4hrzilqgnjojtbz1swt.svg" alt="WeChat Template" style="width: 80px;"/>',
    content: `
    <style>
.wechat {
  margin-bottom: 30px;
  font-weight: 100;
  overflow: hidden;
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
}

.bsn-header {
  height: 240px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bsn-body {
  background-color: #171432;
  padding: 12px;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.logo-img {
  width: 100px;
  height: 100px;
}

    </style>
      <div class="wechat">
        <div class="bsn-header">
          <div class="logo">
            <img
              src="https://res.cloudinary.com/dlpust9lj/image/upload/v1725423588/ggrm7r0lsml8rk3kqvnd.svg"
              alt=""
              class="logo-img"
            />
          </div>
        </div>

        <div class="bsn-body">
          <img
            src="https://res.cloudinary.com/dlpust9lj/image/upload/v1724988103/csjcmqih0s2e1bm0bgxz.svg"
            alt=""
          />
        </div>
      </div>
`,
  });

  editor.BlockManager.add('button-download-vcard', {
    label: 'Button Download vCard',
    id: 'vcard-button',
    media:
      '<img src="https://res.cloudinary.com/dlpust9lj/image/upload/v1725423580/kf23vvdzl2mdlzxgfsud.svg" alt="Download vCard" style="width: 80px;"/>',
    content: {
      tagName: 'div',
      components: [
        {
          tagName: 'button',
          content: `
                    <img
                      src="./../../../assets/icons/download-square.svg"
                       alt="Download vCard"
                      title="Download vCard"
                    />
                 `,
          attributes: { class: 'icon-item', id: `vcard-button-${Date.now()}` },
          script: function () {
            const btn = this as unknown as HTMLButtonElement;

            // Check if btn is an HTML element and then add event listener
            if (btn && btn.addEventListener) {
              btn.addEventListener('click', () => {
                // alert('Button clicked!');

                const vCardData = `BEGIN:VCARD
                VERSION:3.0
                FN:Phatnttse
                ORG:Company
                TEL:+123456789
                EMAIL:phatnttse@gmail.com
                END:VCARD`;

                const blob = new Blob([vCardData], { type: 'text/vcard' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = 'contact.vcf';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a); // Clean up by removing the anchor element
              });
            }
          },
        },
      ],
    },
  });

  editor.BlockManager.add('template-block', {
    label: 'Business Card 1',
    media:
      '<img src="https://res.cloudinary.com/dlpust9lj/image/upload/v1724991622/p2rxvlzwpw6glvgggxoa.png" alt="Business Card 1" style="width: 80px;border-radius: 10px; max-width:100%; height: auto;"/>',
    content: `
    <style>
      .bsn-sect {
      font-family: Helvetica, serif;
      }
.container-width {
  max-width: 390px;
  width: 100%;
  margin: 0 auto;
}

.bsn-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.bsn {
  width: 100%;
  margin-bottom: 30px;
  border-radius: 15px;
  font-weight: 100;
  overflow: hidden;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.bsn-header {
  height: 240px;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bsn-avatar {
  width: 120px;
  height: 120px;
  border-radius: 100%;
  border: 2px solid #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: absolute;
  top: 170px;
  left: 50%;
  transform: translateX(-50%);
}

.bsn-body {
  background-color: #171432;
  padding-top: 80px;
  padding-bottom: 20px;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.logo {
  margin-bottom: 40px;
}

.logo img {
  width: 140px;
  height: auto;
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
}

.bsn-info {
  font-size: 1.8em;
  margin-bottom: 5px;
  color: #ffffff;
  font-weight: 300;
}

.bsn-name {
  margin: 0;
}

.bsn-body h3 {
  font-weight: 700;
  font-size: 1.5em;
  margin-bottom: 10px;
}

.bsn-position {
  font-size: 14px;
}

.contact-info {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  margin-bottom: 10px;
}

.contact-link {
  color: #ffffff;
  text-decoration: none;
  display: flex;
  align-items: center;
  &:hover {
    text-decoration: underline;
  }
}
.contact-icon {
  margin-right: 6px;
}
.icon-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px;
  justify-items: center;
  align-items: center;
  background-color: #ffffff;
  margin-top: 20px;
  padding: 14px;
  border-radius: 10px;
}

.icon-item {
  width: 42px;
  height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-item img {
  width: 26px;
  height: 26px;
}
.bsn-foot {
  margin-top: 20px;
}
.bsn-foot .company-name {
  font-size: 14px;
  color: #ffffff;
  margin-bottom: 5px;
  text-transform: uppercase;
  letter-spacing: 6px;
  padding: 10px;
  opacity: 0.6;
}
button {
  border: none;
  background: none;
  cursor: pointer;
}
    .hidden { display: none; }
    .dialog-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 40; }
    .dialog-content { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 50; display: flex; align-items: center; justify-content: center; }
    .dialog-box { background-color: rgb(255, 255, 255); padding: 10px; border-radius: 8px; box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 8px; max-width: 400px; width: 100%; position: relative; }
    .dialog-title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }

    </style>

    <section class="bsn-sect">
  <div class="container-width">
    <div class="bsn-container">
      <div class="bsn">
        <div class="bsn-header">
          <div class="logo">
            <img
              src="{{logo}}"
              alt="Logo"
            />
          </div>
        </div>
        <img
          title="Xem chi tiết"
          src="{{avatar}}"
          class="bsn-avatar"
          style="object-fit: cover"
          alt="Avatar"
        />
        <div class="bsn-body">
          <div class="bsn-info">
            <h5 class="bsn-name">{{fullName}}</h5>
            <p class="bsn-position">{{position}}</p>
            <div class="contact-info">
              <img
                style="width: 18px; height: 18px"
                src="./../../../assets/icons/svg-phone.svg"
                alt=""
                class="contact-icon"
              />
              <a href="tel:0392341142" class="contact-link">
                {{phone}}
              </a>
            </div>
            <div class="contact-info">
              <img
                style="width: 18px; height: 18px"
                src="./../../../assets/icons/svg-website.svg"
                alt=""
                class="contact-icon"
              />
              <a
                href="mailto:andyng&#64;primecaptitalgroup.vn"
                class="contact-link"
              >
                {{email}}
              </a>
            </div>
          </div>
          <div class="icon-grid">
            <a href="" class="icon-item">
              <img src="" alt="Zalo" />
            </a>
          </div>
          <div class="bsn-foot">
            <p class="company-name">prime capital group</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
    `,
    category: 'Templates',
  });

  editor.BlockManager.add('link-image', {
    label: 'Link with image',
    media:
      '<img src="https://localhost:7191/images/icon-zalo.svg"  style="width: 80px;border-radius: 10px; max-width:100%;"/>',
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
