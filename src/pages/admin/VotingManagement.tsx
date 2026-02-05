import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2, Upload, Trophy, Users } from "lucide-react";

interface VotingCampaign {
  id: string;
  title: string;
  description: string | null;
  end_date: string;
  is_active: boolean;
  created_at: string;
}

interface VotingCandidate {
  id: string;
  campaign_id: string;
  name: string;
  image_url: string | null;
  vote_count: number;
  display_order: number;
}

const VotingManagement = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<VotingCampaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<VotingCampaign | null>(null);
  const [candidates, setCandidates] = useState<VotingCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewCampaignDialog, setShowNewCampaignDialog] = useState(false);
  const [showNewCandidateDialog, setShowNewCandidateDialog] = useState(false);

  // New campaign form state
  const [newCampaign, setNewCampaign] = useState({
    title: "",
    description: "",
    end_date: "",
  });

  // New candidate form state
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    image: null as File | null,
  });

  useEffect(() => {
    checkAuth();
    fetchCampaigns();
  }, []);

  useEffect(() => {
    if (selectedCampaign) {
      fetchCandidates(selectedCampaign.id);
    }
  }, [selectedCampaign]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/admin/login");
      return;
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!roleData || roleData.role !== "admin") {
      toast.error("You don't have admin access");
      navigate("/admin/login");
    }
  };

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from("voting_campaigns")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      toast.error("Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  };

  const fetchCandidates = async (campaignId: string) => {
    try {
      const { data, error } = await supabase
        .from("voting_candidates")
        .select("*")
        .eq("campaign_id", campaignId)
        .order("display_order");

      if (error) throw error;
      setCandidates(data || []);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      toast.error("Failed to load candidates");
    }
  };

  const createCampaign = async () => {
    try {
      const { error } = await supabase
        .from("voting_campaigns")
        .insert({
          title: newCampaign.title,
          description: newCampaign.description || null,
          end_date: newCampaign.end_date,
        });

      if (error) throw error;

      toast.success("Campaign created successfully");
      setShowNewCampaignDialog(false);
      setNewCampaign({ title: "", description: "", end_date: "" });
      fetchCampaigns();
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("Failed to create campaign");
    }
  };

  const toggleCampaignActive = async (campaign: VotingCampaign) => {
    try {
      // If activating, first deactivate all other campaigns
      if (!campaign.is_active) {
        await supabase
          .from("voting_campaigns")
          .update({ is_active: false })
          .neq("id", campaign.id);
      }

      const { error } = await supabase
        .from("voting_campaigns")
        .update({ is_active: !campaign.is_active })
        .eq("id", campaign.id);

      if (error) throw error;

      toast.success(`Campaign ${campaign.is_active ? "deactivated" : "activated"}`);
      fetchCampaigns();
    } catch (error) {
      console.error("Error toggling campaign:", error);
      toast.error("Failed to update campaign");
    }
  };

  const deleteCampaign = async (campaignId: string) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;

    try {
      const { error } = await supabase
        .from("voting_campaigns")
        .delete()
        .eq("id", campaignId);

      if (error) throw error;

      toast.success("Campaign deleted");
      if (selectedCampaign?.id === campaignId) {
        setSelectedCampaign(null);
        setCandidates([]);
      }
      fetchCampaigns();
    } catch (error) {
      console.error("Error deleting campaign:", error);
      toast.error("Failed to delete campaign");
    }
  };

  const addCandidate = async () => {
    if (!selectedCampaign) return;

    try {
      let imageUrl = null;

      if (newCandidate.image) {
        const fileExt = newCandidate.image.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("voting-images")
          .upload(fileName, newCandidate.image);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("voting-images")
          .getPublicUrl(fileName);

        imageUrl = urlData.publicUrl;
      }

      const { error } = await supabase
        .from("voting_candidates")
        .insert({
          campaign_id: selectedCampaign.id,
          name: newCandidate.name,
          image_url: imageUrl,
          display_order: candidates.length,
        });

      if (error) throw error;

      toast.success("Candidate added");
      setShowNewCandidateDialog(false);
      setNewCandidate({ name: "", image: null });
      fetchCandidates(selectedCampaign.id);
    } catch (error) {
      console.error("Error adding candidate:", error);
      toast.error("Failed to add candidate");
    }
  };

  const deleteCandidate = async (candidateId: string) => {
    if (!confirm("Are you sure you want to delete this candidate?")) return;

    try {
      const { error } = await supabase
        .from("voting_candidates")
        .delete()
        .eq("id", candidateId);

      if (error) throw error;

      toast.success("Candidate deleted");
      if (selectedCampaign) {
        fetchCandidates(selectedCampaign.id);
      }
    } catch (error) {
      console.error("Error deleting candidate:", error);
      toast.error("Failed to delete candidate");
    }
  };

  const totalVotes = candidates.reduce((sum, c) => sum + c.vote_count, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate("/admin/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Voting Management</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Campaigns List */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Campaigns</CardTitle>
              <Dialog open={showNewCampaignDialog} onOpenChange={setShowNewCampaignDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Campaign
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Campaign</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={newCampaign.title}
                        onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                        placeholder="Vote for your favorite..."
                      />
                    </div>
                    <div>
                      <Label>Description (optional)</Label>
                      <Textarea
                        value={newCampaign.description}
                        onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                        placeholder="Help us choose the winner..."
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="datetime-local"
                        value={newCampaign.end_date}
                        onChange={(e) => setNewCampaign({ ...newCampaign, end_date: e.target.value })}
                      />
                    </div>
                    <Button onClick={createCampaign} disabled={!newCampaign.title || !newCampaign.end_date}>
                      Create Campaign
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {campaigns.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No campaigns yet</p>
              ) : (
                <div className="space-y-3">
                  {campaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedCampaign?.id === campaign.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedCampaign(campaign)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{campaign.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Ends: {new Date(campaign.end_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={campaign.is_active}
                            onCheckedChange={() => toggleCampaignActive(campaign)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteCampaign(campaign.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      {campaign.is_active && (
                        <span className="inline-block mt-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                          Active
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Candidates & Votes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                {selectedCampaign ? `Candidates - ${selectedCampaign.title}` : "Select a Campaign"}
              </CardTitle>
              {selectedCampaign && (
                <Dialog open={showNewCandidateDialog} onOpenChange={setShowNewCandidateDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm" disabled={candidates.length >= 5}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Candidate
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Candidate</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={newCandidate.name}
                          onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                          placeholder="Candidate name"
                        />
                      </div>
                      <div>
                        <Label>Image</Label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            setNewCandidate({ ...newCandidate, image: e.target.files?.[0] || null })
                          }
                        />
                      </div>
                      <Button onClick={addCandidate} disabled={!newCandidate.name}>
                        <Upload className="h-4 w-4 mr-2" />
                        Add Candidate
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </CardHeader>
            <CardContent>
              {!selectedCampaign ? (
                <p className="text-muted-foreground text-center py-8">
                  Select a campaign to manage candidates
                </p>
              ) : candidates.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No candidates yet. Add up to 5 candidates.
                </p>
              ) : (
                <div className="space-y-4">
                  {/* Stats */}
                  <div className="flex gap-4 mb-4">
                    <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                      <Users className="h-4 w-4" />
                      <span className="text-sm font-medium">{totalVotes} Total Votes</span>
                    </div>
                  </div>

                  {/* Candidates Table */}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Votes</TableHead>
                        <TableHead>%</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {candidates
                        .sort((a, b) => b.vote_count - a.vote_count)
                        .map((candidate, index) => (
                          <TableRow key={candidate.id}>
                            <TableCell>
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                                {candidate.image_url ? (
                                  <img
                                    src={candidate.image_url}
                                    alt={candidate.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                                    No img
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                {index === 0 && candidate.vote_count > 0 && (
                                  <Trophy className="h-4 w-4 text-yellow-500" />
                                )}
                                {candidate.name}
                              </div>
                            </TableCell>
                            <TableCell>{candidate.vote_count}</TableCell>
                            <TableCell>
                              {totalVotes > 0
                                ? `${Math.round((candidate.vote_count / totalVotes) * 100)}%`
                                : "0%"}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteCandidate(candidate.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VotingManagement;
