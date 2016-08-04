import chokidar from 'chokidar';
import { debounce } from 'lodash';
import notifier from 'node-notifier';
import { handler as link } from './link.js';
import parseConfig from '../parse-config.js';

export const command = 'watch';
export const desc = 'watch and re-link the cloned repos';
export const builder = {};

export function handler() {
  const { repos } = parseConfig();
  const folders = repos.map(r => r.name);
  const paths = folders.map(f => `./${f}/package.json`);
  let linking = false;
  chokidar.watch(paths).on('all', () => {
    if (!linking) {
      linking = true;
      notifier.notify({
        title: 'ganon',
        message: 'starting link',
      });
      link()
        .catch()
        .then(() => notifier.notify({
          title: 'ganon',
          message: 'finished link',
        }))
        .then(() => linking = false);
    }
  });
}
