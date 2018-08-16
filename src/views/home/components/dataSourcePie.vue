<template>
    <div style="width:100%;height:100%;" id="data_source_con"></div>
</template>

<script>
import echarts from 'echarts';

export default {
    name: 'dataSourcePie',
    data () {
        return {
            //
        }; 
    },
    mounted () {
        this.$nextTick(() => {
            var dataSourcePie = echarts.init(document.getElementById('data_source_con'));
            const option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 'right',
                    data: ['一星评价', '二星评价', '三星评价', '四星评价', '五星评价']
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: '66%',
                        center: ['50%', '60%'],
                        data: [
                            {value: 0, name: '一星评价', itemStyle: {normal: {color: '#9bd598'}}},
                            {value: 0, name: '二星评价', itemStyle: {normal: {color: '#ffd58f'}}},
                            {value: 0, name: '三星评价', itemStyle: {normal: {color: '#abd5f2'}}},
                            {value: 0, name: '四星评价', itemStyle: {normal: {color: '#ab8df2'}}},
                            {value: 0, name: '五星评价', itemStyle: {normal: {color: '#e14f60'}}}
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            dataSourcePie.setOption(option);
            window.addEventListener('resize', function () {
                dataSourcePie.resize();
            });
        });
    }
};
</script>
