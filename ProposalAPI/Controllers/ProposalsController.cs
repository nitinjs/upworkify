
using Google.Apis.Auth.OAuth2;
using Google.Apis.Drive.v3;
using Google.Apis.Services;
using Google.Apis.Util.Store;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Web.Http;

namespace ProposalAPI.Controllers
{
    public class ProposalsController : ApiController
    {
        //static string[] Scopes = { DriveService.Scope.DriveReadonly };
        //static string ApplicationName = "Drive API .NET Quickstart";

        string ProposalsDirectory = string.Empty;
        public ProposalsController()
        {
            ProposalsDirectory = System.Web.Hosting.HostingEnvironment.MapPath("~/Content/Proposals/");
        }

        // GET api/values
        public IEnumerable<string> Get()
        {
            DirectoryInfo dir = new DirectoryInfo(ProposalsDirectory);
            var files = dir.GetFiles("*.txt").Select(x => x.Name).ToList();
            return files.Select(x => new
            {
                index = int.Parse(new String(x.Where(Char.IsDigit).ToArray())),
                value = x
            }).OrderByDescending(x => x.index).Select(x => x.value).ToArray();
        }

        // GET api/values/5
        public string Get(string fileName)
        {
            string content = File.ReadAllText(ProposalsDirectory + fileName);
            return content;
        }

        // POST api/values
        public string Post([FromBody] string fileName)
        {
            string content = File.ReadAllText(ProposalsDirectory + fileName);
            return content;
        }

        // PUT api/values/5
        public void Put([FromBody] ModifyProposalModel model)
        {
            string filePath = ProposalsDirectory + model.fileName;

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
        }

        // DELETE api/values/5
        public void Delete([FromBody] ModifyProposalModel model)
        {
            File.Delete(ProposalsDirectory + model.fileName);
        }
    }
    public class ModifyProposalModel
    {
        public string fileName { get; set; }
        public string contents { get; set; }
    }
}
