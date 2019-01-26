/* eslint-disable */
import SmartSDK from './SmartSDK';

const buildPostData = (key, value) => {
  const commod = {};
  commod[key] = value;
  return commod;
};

export {
  buildPostData,
  SmartSDK,
};
