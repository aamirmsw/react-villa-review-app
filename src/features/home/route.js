import {
  DefaultPage,
  VillaNote,
} from './';

export default {
  path: '/',
  name: 'Home',
  childRoutes: [
    { path: 'default-page',
      name: 'Default page',
      component: VillaNote,
      isIndex: true,
    },
    { path: 'edit-product/:productId', name: 'Edit product', component: VillaNote },
  ],
};



