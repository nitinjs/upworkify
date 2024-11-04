using ProposalAPI.Core.Entities;
using System.Text.Json.Serialization;

namespace ProposalAPI.Core
{
    [JsonSerializable(typeof(ModifyProposalModel[]))]
    [JsonSerializable(typeof(string[]))]
    internal partial class AppJsonSerializerContext : JsonSerializerContext
    {

    }
}
