using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
namespace SharedLib.Filters
{
    public class CustomValidationFilter : IActionFilter
    {
        public void OnActionExecuting(ActionExecutingContext context)
        {
            // Check if there are validation errors
            if (context.ModelState != null && !context.ModelState.IsValid) // Ensure ModelState is not null
            {
                var errors = context.ModelState
                    .Where(e => e.Value?.Errors.Any() == true) // Check if Value is not null before accessing Errors
                    .Select(e => new
                    {
                        Field = e.Key,
                        Messages = e.Value!.Errors.Select(x => x.ErrorMessage).ToList() // Use null-forgiving operator as Value is checked above
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
