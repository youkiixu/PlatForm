<template>
    <div style="width:100%;height:100%;" id="service_request_con"></div>
</template>

<script>
    import echarts from 'echarts';
    import Util from '@/libs/util';
    export default {
        name: 'serviceRequests', 
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
                    '@week': 0,
                    'strMethod': 'QueryCountOrderNumber'
                }
                return Util.getDataGrid(par , undefined , undefined , this).then((res) => {
                    //var res = res
                    if(res.result == 'ok'){
                        var arr = [];
                        var date = [];
                        var Replace = this.filterNumber(res.dgData)
                        var Logistics = this.filterNumber(res.head.Table)
                        var Logistics1 = this.filterNumber(res.head.Table1)

                        arr.push(Logistics)
                        arr.push(Logistics1)
                        arr.push(Replace)

                        res.dgData.map((item) => {
                            date.push(item.Date)
                        })
                        arr.push(date)

                        return Promise.resolve(arr);
                    }
                })
            }
        },
        mounted () {
            this.getData().then((res) => {
                const option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },
                    grid: {
                        top: '3%',
                        left: '1.2%',
                        right: '1%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: [ '周日' , '周一', '周二', '周三', '周四', '周五', '周六']
                    }
                    ],
                    yAxis: [
                    {
                        type: 'value'
                    }
                    ],
                    series: [
                    {
                        name: '物流订单',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {normal: {
                            color: '#2d8cf0'
                        }},
                        data: res[0]
                    },
                    {
                        name: '快递订单',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {normal: {
                            color: '#10A6FF'
                        }},
                        data: res[1]
                    },
                    {
                        name: '代发快递订单',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {normal: {
                            color: '#10A6FF'
                        }},
                        data: res[2]
                    }
                    ]
                };
                const serviceRequestCharts = echarts.init(document.getElementById('service_request_con'));
                serviceRequestCharts.setOption(option);

                window.addEventListener('resize', function () {
                    serviceRequestCharts.resize();
                });
            })
        }
    };
</script>