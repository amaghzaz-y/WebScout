import { createStorage, prefixStorage } from "unstorage";
import cloudflareKVBindingDriver from "unstorage/drivers/cloudflare-kv-binding";

const kvStorage = createStorage({
	driver: cloudflareKVBindingDriver({ binding: "WSKV" }),
});

export const languageStorage = prefixStorage(kvStorage, 'language')
export const indexStorage = prefixStorage(kvStorage, 'index')