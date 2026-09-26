import ImageKit from '@imagekit/nodejs';
import EnvConfig from './env.config.js';

const imageKit = new ImageKit({
    privateKey:EnvConfig.imageKit.privateKey
})

export default imageKit;