export function classNames(...classnames: string[]) {
  return classnames.filter(Boolean).join(' ')
}