export const debounce = <FnType extends () => void>(cb: FnType, delay = 200) => {
	let timer: NodeJS.Timeout;

	return function () {
		clearTimeout(timer);
		timer = setTimeout(() => cb(), delay);
	};
};
