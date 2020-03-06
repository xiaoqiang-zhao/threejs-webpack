<template>
    <div class="standard-base markdown">
        <markdown-doc-content :mdContent="mdContent"/>
        
    </div>
</template>

<script>
import markdownDocContent from '@/components/markdown-doc-content.vue';
import baseMdContent from './demo-01.md';

export default {
    components: {
        markdownDocContent
    },
    data() {
        return {
            mdContent: baseMdContent
        };
    }
};
</script>

<style lang="less" scope>
@import '../assets/base.less';
.demo-01 {
    
}
</style>
