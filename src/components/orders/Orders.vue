<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-input placeholder="请输入内容"  class="input-with-select" style="width:35%">
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-table
            :data="goodorderLists"
            stripe
            border
            style="width: 100%">
                <el-table-column type="index" label="#" width="50"></el-table-column>
                <el-table-column prop="order_number" label="订单编号"></el-table-column>
                <el-table-column prop="order_price" label="订单价格"></el-table-column>
                <el-table-column prop="pay_status" label="是否付款"></el-table-column>
                <el-table-column prop="is_send" label="是否发货"></el-table-column>
                <el-table-column prop="create_time" label="下单时间"></el-table-column>
                <el-table-column  label="操作">
                    <template slot-scope="orderscope">
                        <el-tooltip class="item" effect="dark" content="修改收货地址" placement="top-start">
                            <el-button type="primary" icon="el-icon-edit" @click="getRowOrderList(orderscope.row.order_id)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="查看物流信息" placement="top-start">
                            <el-button type="success" icon="el-icon-location-outline"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 5, 10, 15]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
            <!-- 修改订单信息 -->
            <el-dialog
                title="修改订单地址信息"
                :visible.sync="orderDialogVisible"
                width="45%"
            >
                <el-form :model="orderPutlist">
                    <el-form-item label="省市区/县">
                        <el-select v-model="orderPutlist.consignee_addr" placeholder="请选择" style="width:100%;">
                          <el-option label="区域一" value="shanghai" ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="详细地址" >
                        <el-input v-model="orderPutlist.regioninput" ></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>
<script>
    export default{
        data(){
            return{
                //存放订单列表
                goodorderLists:[],
                total:0,
                queryInfo:{
                    query:'',
                    pagenum:1,//当前页数
                    pagesize:5,//每条显示条数
                    pay_status:'',
                    is_send:''
                },
                orderDialogVisible:false,
                //表单提交数据
                orderPutlist:{}
                // orderPutlist:{
                //     consignee_addr:'',
                //     regioninput:''
                // }
            }
        },
        created () {
            this.getOrderList()
        },
        methods: {
            //获取订单信息
            async getOrderList(){
                const {data: res} = await this.$http.get('orders',{params:this.queryInfo})
                if(res.meta.status !== 200){
                   return this.$message.error("订单列表获取失败")
                }
                this.goodorderLists = res.data.goods
                this.total = res.data.total
                console.log(this.goodorderLists)
            },
            //监听页码值发生的改变
            handleSizeChange(newsize){
                this.queryInfo.pagesize = newsize;
                this.getOrderList();
            },
            handleCurrentChange(newpage){
                this.queryInfo.pagenum = newpage;
                this.getOrderList();
            },
            // showUpdateDialog(){
            //     this.orderDialogVisible = true
            // },
            //获取当前行的信息
            async getRowOrderList(id){
                const {data: res} = await this.$http.get('orders/' + id)
                if(res.meta.status !== 200){
                   return this.$message.error("订单列表获取失败")
                }
                this.orderPutlist = res.data
                console.log(this.orderPutlist)
                this.orderDialogVisible = true
                
            }
        }
        
    }
</script>
<style></style>