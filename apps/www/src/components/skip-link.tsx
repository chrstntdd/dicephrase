import type { JSX } from "solid-js/jsx-runtime"

interface SkipToContentLinkProps {
	children?: JSX.Element
	contentId: string
}

function SkipToContentLink({
	children,
	contentId,
	...passThruProps
}: SkipToContentLinkProps) {
	return (
		<a href={`#${contentId}`} {...passThruProps}>
			{children}
		</a>
	)
}

interface SkipNavContentProps {
	id: string
}

function SkipNavContent({ id }: SkipNavContentProps) {
	return <div id={id} />
}

export { SkipToContentLink, SkipNavContent }
