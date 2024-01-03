import { mount } from '@vue/test-utils';
import crud from './crud.vue';
import { describe, expect, it } from 'vitest';
import { createVuetify } from "vuetify"
import * as components from "vuetify/components"
import * as directives from "vuetify/directives"
import ResizeObserver from "resize-observer-polyfill"
const vuetify = createVuetify({ components, directives })
// console.log("🚀 ~ file: crud.spec.ts:8 ~ vuetify:", vuetify)

global.ResizeObserver = ResizeObserver

describe('crud', () => {
  it('renders the navigation drawer with the correct props', () => {
    const wrapper = mount({
      template: '<v-layout><crud item-name="Item Name" ></crud></v-layout>'
    },
      {
        global: {
          plugins: [vuetify],
          components: {
            crud
          }
        },
        props: {},
      });

    const navigationDrawer = wrapper.findComponent({ name: 'v-navigation-drawer' });
    expect(navigationDrawer.exists()).toBe(true);
    expect(navigationDrawer.props()).toEqual({
      _as: undefined,
      absolute: true, // default
      border: false,
      class: "crud",
      color: undefined,
      disableResizeWatcher: false,
      disableRouteWatcher: false,
      elevation: undefined,
      expandOnHover: false,
      floating: false,
      image: undefined,
      location: "start",
      mobileBreakpoint: undefined,
      modelValue: false,
      name: undefined,
      order: 0,
      permanent: false,
      rail: null,
      railWidth: 56,
      rounded: undefined,
      scrim: true,
      sticky: false,
      style: null,
      tag: "nav",
      temporary: true,
      theme: undefined,
      touchless: false,
      width: 500,
    });

  });

  // it('renders the title slot with the correct item name', () => {
  //   const itemName = 'Item Name';
  //   const wrapper = mount({
  //     template: '<v-layout><crud item-name="Item Name" ><template #title><div data-testid="title-slot">' + itemName + '</div></template></crud></v-layout>',
  //   },
  //     {
  //       global: {
  //         plugins: [vuetify],
  //         components: {
  //           crud
  //         }
  //       },
  //       props: {},
  //     });
  //   console.log(wrapper.html())
  //   const titleSlot = wrapper.find('[data-testid="title-slot"]');
  //   expect(titleSlot.exists()).toBe(true);
  //   expect(titleSlot.text()).toBe(itemName);
  // });

  // it('renders the prepend-title-action slot', () => {
  //   const wrapper = mount(crud, {
  //     slots: {
  //       'prepend-title-action': `<div data-testid="prepend-title-action-slot">Prepend Title Action</div>`,
  //     },
  //   });

  //   const prependTitleActionSlot = wrapper.find('[data-testid="prepend-title-action-slot"]');
  //   expect(prependTitleActionSlot.exists()).toBe(true);
  //   expect(prependTitleActionSlot.text()).toBe('Prepend Title Action');
  // });

  // it('renders the append-title-action slot', () => {
  //   const wrapper = mount(crud, {
  //     slots: {
  //       'append-title-action': `<div data-testid="append-title-action-slot">Append Title Action</div>`,
  //     },
  //   });

  //   const appendTitleActionSlot = wrapper.find('[data-testid="append-title-action-slot"]');
  //   expect(appendTitleActionSlot.exists()).toBe(true);
  //   expect(appendTitleActionSlot.text()).toBe('Append Title Action');
  // });

  // it('renders the form inside the skeleton loader', () => {
  //   const wrapper = mount(crud, {
  //     slots: {
  //       'default': `<form data-testid="form">Form Content</form>`,
  //     },
  //   });

  //   const skeletonLoader = wrapper.findComponent({ name: 'v-skeleton-loader' });
  //   expect(skeletonLoader.exists()).toBe(true);
  //   expect(skeletonLoader.find('[data-testid="form"]').exists()).toBe(true);
  //   expect(skeletonLoader.find('[data-testid="form"]').text()).toBe('Form Content');
  // });

  // it('renders the error banner if there is a getting error', () => {
  //   const wrapper = mount(crud, {
  //     data() {
  //       return {
  //         hasGettingError: 'Error message',
  //       };
  //     },
  //   });

  //   const errorBanner = wrapper.findComponent({ name: 'v-banner' });
  //   expect(errorBanner.exists()).toBe(true);
  //   expect(errorBanner.props()).toEqual({
  //     lines: 'three',
  //     color: 'error',
  //     icon: 'mdi-alert-circle-outline',
  //   });
  //   expect(errorBanner.text()).toContain('Error While getting Data');
  //   expect(errorBanner.text()).toContain('Error message');
  // });

  // it('renders the default slot if there is no getting error', () => {
  //   const wrapper = mount(crud, {
  //     data() {
  //       return {
  //         hasGettingError: false,
  //       };
  //     },
  //     slots: {
  //       // <div data-testid="default-slot">Default Slot Content</div>`,
  //     },
  //   });

  //   const skeletonLoader = wrapper.findComponent({ name: 'v-skeleton-loader' });
  //   expect(skeletonLoader.exists()).toBe(true);
  //   expect(skeletonLoader.find('[data-testid="default-slot"]').exists()).toBe(true);
  //   expect(skeletonLoader.find('[data-testid="default-slot"]').text()).toBe('Default Slot Content');
  // });

  // it('renders the actions slot with the correct buttons', () => {
  //   const wrapper = mount(crud, {
  //     slots: {
  //       actions: `
  //         <div data-testid="actions-slot">
  //           <button data-testid="cancel-button">Cancel</button>
  //           <button data-testid="save-button">Save</button>
  //         </div>
  //       `,
  //     },
  //   });

  //   const actionsSlot = wrapper.find('[data-testid="actions-slot"]');
  //   expect(actionsSlot.exists()).toBe(true);

  //   const cancelButton = actionsSlot.find('[data-testid="cancel-button"]');
  //   expect(cancelButton.exists()).toBe(true);
  //   expect(cancelButton.text()).toBe('Cancel');

  //   const saveButton = actionsSlot.find('[data-testid="save-button"]');
  //   expect(saveButton.exists()).toBe(true);
  //   expect(saveButton.text()).toBe('Save');
  // });

  // it('triggers the save method when the save button is clicked', async () => {
  //   const saveMock = jest.fn();
  //   const wrapper = mount(crud, {
  //     methods: {
  //       save: saveMock,
  //     },
  //     slots: {
  //       // <button data-testid="save-button" @click="save">Save</button>`,
  //     },
  //   });

  //   const saveButton = wrapper.find('[data-testid="save-button"]');
  //   await saveButton.trigger('click');

  //   expect(saveMock).toHaveBeenCalled();
  // });

  // it('triggers the close method when the close button is clicked', async () => {
  //   const closeMock = jest.fn();
  //   const wrapper = mount(crud, {
  //     methods: {
  //       close: closeMock,
  //     },
  //     slots: {
  //       // <button data-testid="close-button" @click="close">Close</button>`,
  //     },
  //   });

  //   const closeButton = wrapper.find('[data-testid="close-button"]');
  //   await closeButton.trigger('click');

  //   expect(closeMock).toHaveBeenCalled();
  // });
});