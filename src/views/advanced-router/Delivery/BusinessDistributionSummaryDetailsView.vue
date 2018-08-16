
<style lang="less">

</style>

<template>
    <div>
        <Row>
            <Card>
                <p slot="title">
                    <Icon type="ios-list"></Icon>
                    业务配送汇总详细
                </p>
                <Row>
                    <initDataGridCompoent ref="dataGrid" :param="formData" :showControl="true" ></initDataGridCompoent>
                </Row>
            </Card>
        </Row>
    </div>
</template>

<script>
import Util from '@/libs/util';
import initDataGridCompoent from '@/views/toolbar-components/initDataGrid-noPage-component';

export default {
    name: 'BusinessDistributionSummaryDetailsView',
    components: {
        initDataGridCompoent
    },
    data () {
        return {
            formData: undefined
        };
    },
    methods: {
        init() {
            var _this = this;
            this.formData = this.$route.params;
            if(_this.formData.strMethod == undefined){
                return;
            }
            setTimeout(function() {
                _this.$refs.dataGrid.initDataGrid()
            } , 20)
        }
    },
    mounted () {
        this.init();
    },
    created() {
        
    },
    watch: {
        '$route' () {
            this.init();
        }
    }
};
</script>
