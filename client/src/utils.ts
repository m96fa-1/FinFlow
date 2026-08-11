export const validateEmail = (email: string) => {
	return email.match(
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/
	);
}

export const validatePassword = (password: string) => {
	return password.match(
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@.#$!%*?&]{8,15}$/
	);
}