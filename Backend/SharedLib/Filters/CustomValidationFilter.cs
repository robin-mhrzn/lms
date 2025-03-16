using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
namespace SharedLib.Filters
{

    public class CustomValidationFilter : IActionFilter
    {
        public void OnActionExecuting(ActionExecutingContext context)
        {
            // Check if there are validation errors
            if (!context.ModelState.IsValid)
            {
                var errors = context.ModelState
                    .Where(e => e.Value.Errors.Any())
                    .Select(e => new
                    {
                        Field = e.Key,
                        Messages = e.Value.Errors.Select(x => x.ErrorMessage).ToList()
                    })
                    .ToList();

                var response = new
                {
                    Success = false,
                    Message = "Validation failed",
                    Errors = errors
                };
                context.Result = new BadRequestObjectResult(response);
            }
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
        }
    }
}
