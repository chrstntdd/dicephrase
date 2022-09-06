interface SkipToContentLinkProps {
	id: string
}

function SkipToContentLink(props: SkipToContentLinkProps) {
	return <a href={`#${props.id}`} aria-label="Skip to main content" />
}

interface SkipNavContentProps {
	id: string
}

function SkipNavContent(props: SkipNavContentProps) {
	return <div id={props.id} />
}

export { SkipToContentLink, SkipNavContent }
