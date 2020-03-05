<template>
    <div class="summary"> 
        <markdown-doc-content :mdContent="mdContent"/>
    </div>
</template>

<script>
import markdownDocContent from '@/components/markdown-doc-content.vue';
import summaryMdContent from './summary.md';

export default {
    components: {
        markdownDocContent
    },
    data() {
        return {
            mdContent: summaryMdContent
        };
    }
};
</script>
