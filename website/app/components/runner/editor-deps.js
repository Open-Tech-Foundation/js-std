// Keep package imports static inside this local module. The web compiler can
// split this module on demand, while browsers never have to resolve a package
// name such as `@codemirror/view` themselves.
export { basicSetup } from 'codemirror';
export { EditorView, keymap } from '@codemirror/view';
export { Compartment, Prec } from '@codemirror/state';
export { javascript } from '@codemirror/lang-javascript';
export { oneDark } from '@codemirror/theme-one-dark';
