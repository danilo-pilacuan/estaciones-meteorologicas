import { boot } from 'quasar/wrappers';
import Openlayers from 'vue3-openlayers';

export default boot(({ app }) => {
  app.use(Openlayers);
});
