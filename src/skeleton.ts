/**
 * MIT License - Copyright (C) 2018 - Ádám Liszkai <adaliszk@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

console.time('Skeleton.WebsiteElement::constructor()');
console.time('Skeleton.PageElement::constructor()');

export namespace Skeleton {

    export interface RegionsArray {
        [index: number]: string;
    }

    export interface SlotArray {
        [index: string]: HTMLSlotElement;
    }

    /**
     * Base Skeleton class
     *
     * reusable utility functions
     *
     * @since v0.1.0
     */
    export class Element extends HTMLElement {
        public root: ShadowRoot | HTMLElement;
        constructor() {
            super();
            this.attachShadow({mode: 'open'});
            this.root = this.shadowRoot || this;
            // Creating an instance from the template
            const templateInstance = document.importNode(this.template.content, true);
            // Rendering the template into the ShadowDOM or into the ShadyDOM
            this.root.appendChild(templateInstance);
        }

        // noinspection JSUnusedGlobalSymbols
        // noinspection JSMethodCanBeStatic
        get template(): HTMLTemplateElement {
            const template = document.createElement('template');
            template.innerHTML += `<slot></slot>`;
            return template;
        }
    }

    /**
     * Website Skeleton Element
     *
     * it creates the desired regions what you can style with css grid or css flexbox
     *
     * @since v0.1.0
     */
    export class WebsiteElement extends Element {

        public regions: Skeleton.RegionsArray;
        public apiUrl: string;
        public apiType: string;
        public $: Skeleton.SlotArray;

        private _regionsRaw: string;

        constructor() {
            super();

            this.apiUrl = this.getAttribute('api-url') || '/api';
            this.apiType = this.getAttribute('api-type') || 'rest';

            this._regionsRaw = this.getAttribute('regions') || 'header,navigation,content,right,footer';
            this.regions = this._regionsRaw.split(',');

            this.$ = {};
            for (const regionName in this.regions)
                this.$[regionName] = <HTMLSlotElement>this.root.querySelector(`slot[name=${regionName}]`);

            console.timeEnd('Skeleton.WebsiteElement::constructor()');
        }

        // noinspection JSUnusedGlobalSymbols
        get template(): HTMLTemplateElement {
            const template = document.createElement('template');
            template.innerHTML += `<div style="display: none;"><slot></slot></div>`;
            for (const regionName in this.regions)
                template.innerHTML += `<slot name="${regionName}"></slot>`;
            return template;
        }
    }

    /**
     * Website Page Element
     *
     * it holds a page element and controls the rendering, it make sure that it doesn't render more what's needed in the
     * first viewport and when the browser is idle we load the addition contents.
     *
     * @since v0.1.0
     */
    export class PageElement extends Element {

        public apiEndpoint: string;

        constructor() {
            super();
            this.apiEndpoint = this.getAttribute('api-endpoint') || 'rest';
            console.timeEnd('Skeleton.PageElement::constructor()');
        }
    }
}