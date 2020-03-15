/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import '@stencil/core';

import '@ionic/core';
import 'ionicons';
import {
  PrismaUISDK,
} from '@prismadelabs/prismaidui';


export namespace Components {

  interface AppCover {}
  interface AppCoverAttributes extends StencilHTMLAttributes {}

  interface AppHome {
    'onTutorialClosed': () => void;
    'sdkUI': PrismaUISDK;
  }
  interface AppHomeAttributes extends StencilHTMLAttributes {
    'sdkUI'?: PrismaUISDK;
  }

  interface AppPortrait {}
  interface AppPortraitAttributes extends StencilHTMLAttributes {}

  interface AppRoot {}
  interface AppRootAttributes extends StencilHTMLAttributes {}

  interface AppStart {
    'onBack': () => void;
  }
  interface AppStartAttributes extends StencilHTMLAttributes {}

  interface AppVerify {
    'codeID': any;
    'sdkUI': PrismaUISDK;
  }
  interface AppVerifyAttributes extends StencilHTMLAttributes {
    'codeID'?: any;
    'sdkUI'?: PrismaUISDK;
  }
}

declare global {
  interface StencilElementInterfaces {
    'AppCover': Components.AppCover;
    'AppHome': Components.AppHome;
    'AppPortrait': Components.AppPortrait;
    'AppRoot': Components.AppRoot;
    'AppStart': Components.AppStart;
    'AppVerify': Components.AppVerify;
  }

  interface StencilIntrinsicElements {
    'app-cover': Components.AppCoverAttributes;
    'app-home': Components.AppHomeAttributes;
    'app-portrait': Components.AppPortraitAttributes;
    'app-root': Components.AppRootAttributes;
    'app-start': Components.AppStartAttributes;
    'app-verify': Components.AppVerifyAttributes;
  }


  interface HTMLAppCoverElement extends Components.AppCover, HTMLStencilElement {}
  var HTMLAppCoverElement: {
    prototype: HTMLAppCoverElement;
    new (): HTMLAppCoverElement;
  };

  interface HTMLAppHomeElement extends Components.AppHome, HTMLStencilElement {}
  var HTMLAppHomeElement: {
    prototype: HTMLAppHomeElement;
    new (): HTMLAppHomeElement;
  };

  interface HTMLAppPortraitElement extends Components.AppPortrait, HTMLStencilElement {}
  var HTMLAppPortraitElement: {
    prototype: HTMLAppPortraitElement;
    new (): HTMLAppPortraitElement;
  };

  interface HTMLAppRootElement extends Components.AppRoot, HTMLStencilElement {}
  var HTMLAppRootElement: {
    prototype: HTMLAppRootElement;
    new (): HTMLAppRootElement;
  };

  interface HTMLAppStartElement extends Components.AppStart, HTMLStencilElement {}
  var HTMLAppStartElement: {
    prototype: HTMLAppStartElement;
    new (): HTMLAppStartElement;
  };

  interface HTMLAppVerifyElement extends Components.AppVerify, HTMLStencilElement {}
  var HTMLAppVerifyElement: {
    prototype: HTMLAppVerifyElement;
    new (): HTMLAppVerifyElement;
  };

  interface HTMLElementTagNameMap {
    'app-cover': HTMLAppCoverElement
    'app-home': HTMLAppHomeElement
    'app-portrait': HTMLAppPortraitElement
    'app-root': HTMLAppRootElement
    'app-start': HTMLAppStartElement
    'app-verify': HTMLAppVerifyElement
  }

  interface ElementTagNameMap {
    'app-cover': HTMLAppCoverElement;
    'app-home': HTMLAppHomeElement;
    'app-portrait': HTMLAppPortraitElement;
    'app-root': HTMLAppRootElement;
    'app-start': HTMLAppStartElement;
    'app-verify': HTMLAppVerifyElement;
  }


  export namespace JSX {
    export interface Element {}
    export interface IntrinsicElements extends StencilIntrinsicElements {
      [tagName: string]: any;
    }
  }
  export interface HTMLAttributes extends StencilHTMLAttributes {}

}