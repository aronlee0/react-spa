import { resolve } from "path";

const alias = {
  React: 'react',
  store: resolve(process.cwd(),'./src/store/index.js')
}
export default alias
