export function capitalizeString(str: string) {
	return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function stringToSlug(str: string) {
	return str
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');
}

export function slugToString(slug: string) {
	return slug
		.replace(/^\/+|\/+$/g, '')
		.replace(/[-_]+/g, ' ')
		.replace(/\b\w/g, (char) => char.toUpperCase());
}

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

export function toCurrency(amount: string | number, locale?: string, currency?: string) {
	if (Number.isNaN(Number(amount))) return NaN;
	return parseFloat(Number(amount).toFixed(2)).toLocaleString(locale ?? 'en-US', { style: 'currency', currency: currency ?? 'USD' });
}

/**
 * @param fixedDecimals If true shows 00 after the decimal point even if the number is an integer
 */
export function toUSD(amount: string | number, fixedDecimals?: boolean) {
	if (Number.isNaN(Number(amount))) return NaN;
	return fixedDecimals ? Number(amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : `$${Number(amount).toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
}

export type DateFormat = 'yyyy-mm-dd' | 'dd/mm/yyyy' | 'mm/dd/yyyy';

export function formatDate(date: Date, format: DateFormat) {
	switch (format) {
		case 'yyyy-mm-dd': return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
		case 'dd/mm/yyyy': return date.toLocaleString('en-UK', { day: '2-digit', month: '2-digit', year: 'numeric' });
		case 'mm/dd/yyyy': return date.toLocaleString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
	}
}