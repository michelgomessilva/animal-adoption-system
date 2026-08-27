using System.Collections.Generic;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace ONG.API.Serialization
{
    public class SwaggerEnumParametersFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            if (operation.Parameters == null) return;

            foreach (var parameter in operation.Parameters)
            {
                var paramName = parameter.Name.ToLowerInvariant();
                switch (paramName)
                {
                    case "species":
                        parameter.Schema.Enum = new List<IOpenApiAny>
                        {
                            new OpenApiString("DOG"),
                            new OpenApiString("CAT")
                        };
                        break;
                    case "sex":
                        parameter.Schema.Enum = new List<IOpenApiAny>
                        {
                            new OpenApiString("MALE"),
                            new OpenApiString("FEMALE")
                        };
                        break;
                    case "size":
                        parameter.Schema.Enum = new List<IOpenApiAny>
                        {
                            new OpenApiString("SMALL"),
                            new OpenApiString("MEDIUM"),
                            new OpenApiString("LARGE")
                        };
                        break;
                    case "status":
                        parameter.Schema.Enum = new List<IOpenApiAny>
                        {
                            new OpenApiString("AVAILABLE"),
                            new OpenApiString("IN_ADOPTION_PROCESS"),
                            new OpenApiString("ADOPTED")
                        };
                        break;
                    case "orderby":
                        parameter.Schema.Enum = new List<IOpenApiAny>
                        {
                            new OpenApiString("name"),
                            new OpenApiString("name_desc"),
                            new OpenApiString("species"),
                            new OpenApiString("species_desc"),
                            new OpenApiString("size"),
                            new OpenApiString("size_desc"),
                            new OpenApiString("createdAt"),
                            new OpenApiString("createdAt_desc")
                        };
                        break;
                }
            }
        }
    }
}
