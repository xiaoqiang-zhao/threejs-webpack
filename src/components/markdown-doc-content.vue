<template>
    <section class="markdown-doc-content">
        <div class="markdown" v-html="contents"></div>
    </section>
</template>

<script>
import remark from 'remark';
import midas from 'remark-midas';
import html from 'remark-html';
import highlight from 'remark-highlight.js';

import 'github-markdown-css/github-markdown.css';
import '@/assets/markdown-style-reset.less';
import 'highlight.js/styles/solarized-light.css';

export default {
    props: {
        mdContent: String
    },
    data() {
        return {
            contents: ''
        };
    },
    created() {
        remark()
            .use([html, midas])
            .use(highlight)
            .process(this.mdContent, (err, file) => {
                this.contents = file.contents;
            });
    }
}
</script>
