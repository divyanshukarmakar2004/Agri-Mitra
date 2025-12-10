import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/Table";
import { Sidebar } from "../components/Sidebar";
import {
  Search,
  Filter,
  Users,
  MapPin,
  Phone,
  ChevronRight,
  Menu,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const districts = [
  "all",
  "Angul",
  "Balangir",
  "Balasore",
  "Bargarh",
  "Bhadrak",
  "Bhubaneswar",
  "Boudh",
  "Cuttack",
  "Deogarh",
  "Dhenkanal",
  "Gajapati",
  "Ganjam",
  "Jagatsinghpur",
  "Jajpur",
  "Jharsuguda",
  "Kalahandi",
  "Kandhamal",
  "Kendrapara",
  "Kendujhar",
  "Khordha",
  "Koraput",
  "Malkangiri",
  "Mayurbhanj",
  "Nabarangpur",
  "Nayagarh",
  "Nuapada",
  "Puri",
  "Rayagada",
  "Sambalpur",
  "Subarnapur",
  "Sundargarh",
];

import { FARMERS } from "../data/farmers";

const STATIC_FALLBACK = [];

export default function FarmersPage() {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [farmers, setFarmers] = useState(STATIC_FALLBACK);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const normalized = FARMERS.map((u) => ({
      id: u.id,
      name: u.nameKey,
      district: u.stateKey,
      village: u.cityKey,
      phone: u.phone || "",
      landSize: "-",
      crops: [],
      registrationDate: "",
      status: "active",
      kccNumber: "-",
    }));
    setFarmers(normalized);
    setLoading(false);
  }, []);

  const filteredFarmers = farmers.filter((farmer) => {
    const matchesSearch =
      farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict =
      selectedDistrict === "all" || farmer.district === selectedDistrict;
    const matchesStatus =
      selectedStatus === "all" || farmer.status === selectedStatus;

    return matchesSearch && matchesDistrict && matchesStatus;
  });

  const totalPages = Math.ceil(filteredFarmers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFarmers = filteredFarmers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="layout-container bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="content-container flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                {t("farmers.title")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("farmers.subtitle")}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              {t("farmers.count", { count: filteredFarmers.length })}
            </Badge>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Filters and Search */}
          <Card className="animate-in fade-in-0 slide-in-from-top-4 duration-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-primary" />
                <span>{t("farmers.searchFilter")}</span>
              </CardTitle>
              <CardDescription>{t("farmers.searchHint")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t("farmers.searchPlaceholder")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select
                  value={selectedDistrict}
                  onValueChange={setSelectedDistrict}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("farmers.selectDistrict")} />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district === "all"
                          ? t("common.allDistricts")
                          : t(`district.${district}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("farmers.selectStatus")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("common.allStatus")}</SelectItem>
                    <SelectItem value="active">{t("status.active")}</SelectItem>
                    <SelectItem value="pending">
                      {t("status.pending")}
                    </SelectItem>
                    <SelectItem value="inactive">
                      {t("status.inactive")}
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedDistrict("all");
                    setSelectedStatus("all");
                  }}
                >
                  {t("common.clearFilters")}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Farmers Table */}
          <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <span>{t("farmers.registeredFarmers")}</span>
              </CardTitle>
              <CardDescription>
                {t("farmers.showing", {
                  shown: paginatedFarmers.length,
                  total: filteredFarmers.length,
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("farmers.columns.id")}</TableHead>
                      <TableHead>{t("farmers.columns.name")}</TableHead>
                      <TableHead>{t("farmers.columns.location")}</TableHead>
                      <TableHead>{t("farmers.columns.contact")}</TableHead>
                      <TableHead>{t("farmers.columns.landSize")}</TableHead>
                      <TableHead>{t("farmers.columns.crops")}</TableHead>
                      <TableHead>{t("farmers.columns.status")}</TableHead>
                      <TableHead>{t("farmers.columns.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading && (
                      <TableRow>
                        <TableCell colSpan={8}>{t("common.loading")}</TableCell>
                      </TableRow>
                    )}
                    {paginatedFarmers.map((farmer, index) => (
                      <TableRow
                        key={farmer.id}
                        className="hover:bg-muted/50 transition-colors animate-in fade-in-0 slide-in-from-left-2"
                        style={{ animationDelay: `${300 + index * 100}ms` }}
                      >
                        <TableCell className="font-medium">
                          {farmer.id}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {t(`farmers.names.${farmer.id}`)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {t("farmers.kcc")}: {farmer.kccNumber}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">
                              {t(`farmers.cities.${farmer.village}`)},{" "}
                              {t(`farmers.states.${farmer.district}`)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{farmer.phone}</span>
                          </div>
                        </TableCell>
                        <TableCell>{farmer.landSize}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {farmer.crops?.length ? (
                              farmer.crops.map((crop) => (
                                <Badge
                                  key={crop}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {t(
                                    `farmers.crops.${
                                      crop.toLowerCase?.() || crop
                                    }`
                                  )}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                -
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-xs ${getStatusColor(
                              farmer.status
                            )}`}
                          >
                            {t(`farmers.status.${farmer.status.toLowerCase()}`)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Link to={`/farmers/${farmer.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-primary/10"
                            >
                              <span className="sr-only">
                                {t("farmers.viewProfile")}
                              </span>
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    {t("common.pageOf", {
                      page: currentPage,
                      total: totalPages,
                    })}
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                    >
                      {t("common.previous")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                    >
                      {t("common.next")}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

