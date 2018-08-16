<template>
    <div style="width:100%;height:100%;" id="visite_volume_con"></div>
</template>

<script>
    import echarts from 'echarts';
    import Util from '@/libs/util';
// 上周每天订单数(代发快递、普通快递、物流订单)
export default {
    name: 'visiteVolume',
    data () {
        return { 
            //
        };
    },
    methods: {
        filterNumber(data) {
            var arr = []
            data.map((item)=>{
                arr.push(item.Count)
            })
            return arr
        },
        getData() {
            let par = {
                '@week': 1,
                'strMethod': 'QueryCountOrderNumber'
            }
            return Util.getDataGrid(par , undefined , undefined , this).then((res) => {
               // var res = res
                if(res.result == 'ok'){
                    var arr = [];
                    var Replace = this.filterNumber(res.dgData)
                    var Logistics = this.filterNumber(res.head.Table)
                    var Logistics1 = this.filterNumber(res.head.Table1)
                    arr.push(Logistics)
                    arr.push(Logistics1)
                    arr.push(Replace)
                    return Promise.resolve(arr);
                }
            })
        }
    },
    mounted () {

        this.$nextTick(() => {
            let visiteVolume = echarts.init(document.getElementById('visite_volume_con'));
            this.getData().then((res) => {
                const option = {
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            
                            type : 'shadow'        
                        }
                    },
                    legend: {
                        data: ['物流订单', '快递订单','代发快递']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis:  {
                        type: 'value'
                    },
                    yAxis: {
                        type: 'category',
                        data: ['周日','周一','周二','周三','周四','周五','周六']
                    },
                    series: [
                    {
                        name: '物流订单',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        data: res[0]
                    },
                    {
                        name: '快递订单',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        data: res[1]
                    },
                    {
                        name: '代发快递',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        data: res[2]
                    }
                    ]
                };

                visiteVolume.setOption(option);

                window.addEventListener('resize', function () {
                    visiteVolume.resize();
                });
            })
            
        });
    }
};
</script>
