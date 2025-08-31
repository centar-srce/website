import type { MarkdownInstance } from 'astro';
import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

interface Frontmatter {
	title: string;
	image: string;
	preview?: string;
}

export interface ArticleData {
	title: string;
	date: Date;
	imageSrc: string;
	Content: AstroComponentFactory;
	slug: string;
	preview?: string;
}

const dateSeparatorIdx = 'yyyy-mm-dd'.length;

export default function getArticles(): ArticleData[] {
	const markdownModules = import.meta.glob<MarkdownInstance<Frontmatter>>(
		'./articles/*.md',
		{ eager: true },
	);
	return Object.values(markdownModules)
		.map((article) => {
			const filename = article.file.split('/').pop()!.replace('.md', '');
			return {
				title: article.frontmatter.title,
				date: new Date(filename.slice(0, dateSeparatorIdx)),
				imageSrc: article.frontmatter.image,
				Content: article.Content,
				slug: filename.slice(dateSeparatorIdx + 1).replace('.md', ''),
				preview: article.frontmatter.preview,
			};
		})
		.sort((a, b) => b.date.getTime() - a.date.getTime());
}
