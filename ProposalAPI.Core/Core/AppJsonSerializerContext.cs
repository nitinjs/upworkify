using ProposalAPI.Core.Entities;
using System.Text.Json.Serialization;

namespace ProposalAPI.Core
{
    [JsonSerializable(typeof(ModifyProposalModel[]))]
    internal partial class AppJsonSerializerContext : JsonSerializerContext
    {

    }
}
