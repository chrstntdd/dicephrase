interface SkipToContentLinkProps {
	id: string
}

function SkipToContentLink(props: SkipToContentLinkProps) {
	return <a href={`#${props.id}`} />
}

interface SkipNavContentProps {
	id: string
}

function SkipNavContent(props: SkipNavContentProps) {
	return <div id={props.id} />
}

export { SkipToContentLink, SkipNavContent }
