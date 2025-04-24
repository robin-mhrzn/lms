using API.Order.BLL.IService;
using API.Order.Model;
using Microsoft.AspNetCore.Mvc;
using SharedLib;

namespace API.Order.Controllers
{

    [Route("[controller]")]

    public class OrderController : AuthBaseController
    {
        private readonly IOrderService _orderService;
        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }
        [HttpPost("Add")]
        public async Task<IActionResult> AddOrder([FromBody] OrderModel model)
        {
            var result = await _orderService.AddOrder(UserId, model);
            return Ok(result);
        }

        [HttpGet("CoursePurchased")]
        public async Task<IActionResult> CoursePurchased(int courseId)
        {
            var result = await _orderService.IsCoursePurchase(courseId, UserId);
            return Ok(result);
        }

        [HttpGet("PurchasedCourses")]
        public async Task<IActionResult> PurchasedCourses([FromQuery] PaymentListRequestModel model)
        {
            var result=await _orderService.GetPurchaseList(UserId, model);  
            return Ok(result);
        }
        
    }
}
