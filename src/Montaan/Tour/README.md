# Montaan/Tour

The Tour component is a tour through a directory tree for quick on-boarding..

The Tour component is used by TourSelector.

The primary reviewer for Tour is Ilmari Heikkinen <hei@heichen.hk>.

## Usage

```tsx
<Tour tourMarkdown="### Foo\n\nStep 1\n\n### Bar\n\nStep 2\n" />
```

## Styling

The Tour component uses [CSS Modules](https://github.com/css-modules/css-modules) for styling. The component stylesheet is at [Tour.module.css].

Example of using the stylesheet:

```css
.Tour {
	display: inline-block;

	:global(.hidden) {
		display: block;
		opacity: 0.1;
	}
}
.title {
	color: red;
}
```

```tsx
<div className={this.styles.Tour}>
	<h1 className={this.styles.title}>Hello from {this.styles.title}!</h1>
	<p className="hidden">
		This P is using the global class <code>.hidden</code>
	</p>
</div>
```

## Assets

Any assets (images, fonts, 3D models, static files, etc.) used by the component are in [assets/]. Import the asset into your script file to get the post-build URL.

```jsx
import myImage from './assets/myImage.svg';
// ...
<img src={myImage}>
```

## API

### Props

```tsx
export interface TourProps extends RouteComponentProps {
	tourMarkdown: string;
	repoPrefix: string;
	name: string;
}
```

### Interfaces

```tsx
export interface TourProps extends RouteComponentProps {
	tourMarkdown: string;
	repoPrefix: string;
	name: string;
}
```
