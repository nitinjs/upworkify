using ProposalAPI.Core;
using ProposalAPI.Core.Entities;
using System.Text.Json.Serialization;
using System.IO;
using System.Reflection;
using System.Net;

var builder = WebApplication.CreateSlimBuilder(args);

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.TypeInfoResolverChain.Insert(0, AppJsonSerializerContext.Default);
});
builder.Services.AddCors();

var app = builder.Build();
app.UseCors(policy =>
{
    policy.AllowAnyHeader();
    policy.AllowAnyMethod();
    policy.AllowAnyOrigin();
});

string ProposalsDirectory = Environment.CurrentDirectory + "\\" + @"Content\Proposals\";

Func<Exception, IResult> ErrorDetails = (ex) =>
{
    return Results.Problem(new Microsoft.AspNetCore.Mvc.ProblemDetails()
    {
        Title = "Unexpected error occurred",
        Detail = ex.Message,
        Status = (int)HttpStatusCode.InternalServerError
    });
};

var proposalApi = app.MapGroup("/proposals");
proposalApi.MapGet("/", () =>
{
    try
    {
        DirectoryInfo dir = new DirectoryInfo(ProposalsDirectory);
        var files = dir.GetFiles("*.txt").Select(x => x.Name).ToList();
        var data = files.Select(x => new
        {
            index = int.Parse(new String(x.Where(Char.IsDigit).Count() == 0 ? new char[] { '0' } : x.Where(Char.IsDigit).ToArray())),
            value = x
        }).OrderByDescending(x => x.index).Select(x => x.value).ToArray();

        return data.Count() == 0 ? Results.NotFound() : Results.Ok(data);
    }
    catch (Exception ex)
    {
        return ErrorDetails(ex);
    }
});

//proposalApi.MapGet("/{fileName}", (string fileName) =>
//{
//    try
//    {
//        string content = File.ReadAllText(ProposalsDirectory + fileName);
//        return Results.Ok(content);
//    }
//    catch (Exception ex)
//    {
//        return ErrorDetails(ex);
//    }
//});

proposalApi.MapPost("/", (string fileName) =>
{
    try
    {
        string content = File.ReadAllText(ProposalsDirectory + fileName);
        return Results.Ok(content);
    }
    catch (Exception ex)
    {
        return ErrorDetails(ex);
    }
});

proposalApi.MapPut("/", (ModifyProposalModel model) =>
{
    try
    {
        string filePath = ProposalsDirectory + (model.fileName.ToLower().EndsWith(".txt")?model.fileName:model.fileName + ".txt");

        if (File.Exists(filePath))
        {
            File.Delete(filePath);
        }
        FileInfo fle = new FileInfo(filePath);
        FileStream fs = new FileStream(filePath, FileMode.Create, FileAccess.ReadWrite, FileShare.ReadWrite);
        StreamWriter sr = new StreamWriter(fs);
        sr.Write(model.contents);
        sr.Flush();
        sr.Close();
        fs.Close();
        return Results.Ok<string>("Saved successfully");
    }
    catch (Exception ex)
    {
        return ErrorDetails(ex);
    }
});

proposalApi.MapDelete("/", (ModifyProposalModel model) =>
{
    try
    {
        File.Delete(ProposalsDirectory + model.fileName);
        return Results.Ok<string>("Deleted successfully");
    }
    catch (Exception ex)
    {
        return ErrorDetails(ex);
    }
});

app.Run();




