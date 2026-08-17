export function validateFullName(name: string) {
	return name.match(
		/^[\p{L}]([-']?[\p{L}]+)*( [\p{L}]([-']?[\p{L}]+)*)+$/iu
	);
}

export function validateEmail(email: string) {
	return email.match(
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/
	);
}

export function validatePassword(password: string) {
	return password.match(
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@.#$!%*?&]{8,15}$/
	);
}