import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Edit, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const BlogManagement = () => {
  const posts = [
    { id: 1, title: "Como Aumentar Suas Vendas Online", status: "Publicado", date: "15 Jan 2024", views: 1234 },
    { id: 2, title: "Tendências de Design Web 2024", status: "Rascunho", date: "12 Jan 2024", views: 0 },
    { id: 3, title: "SEO Local para Empresas", status: "Publicado", date: "10 Jan 2024", views: 856 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/admin/dashboard" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
              <h1 className="text-xl font-bold">Gestão do Blog</h1>
            </div>
            <Button className="btn-hero">
              <Plus className="h-4 w-4 mr-2" />
              Novo Post
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Posts do Blog</CardTitle>
            <CardDescription>Gerencie artigos e conteúdo do blog</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h3 className="font-medium">{post.title}</h3>
                    <div className="flex items-center space-x-3 mt-1">
                      <Badge className={post.status === "Publicado" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                        {post.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{post.date}</span>
                      <span className="text-sm text-muted-foreground">{post.views} visualizações</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline"><Eye className="h-3 w-3" /></Button>
                    <Button size="sm" variant="outline"><Edit className="h-3 w-3" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlogManagement;