import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
	return {
		id: url.searchParams.get('id')
	};
};
