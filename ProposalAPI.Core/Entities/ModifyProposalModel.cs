using System.Security.Cryptography.X509Certificates;

namespace ProposalAPI.Core.Entities
{
    public record ModifyProposalModel(string fileName, string contents)
    {
    }
}
