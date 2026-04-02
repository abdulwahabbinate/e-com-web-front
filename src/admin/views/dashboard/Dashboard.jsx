import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import { CChartLine } from "@coreui/react-chartjs";
import CIcon from "@coreui/icons-react";
import {
  cilBasket,
  cilCart,
  cilCheckCircle,
  cilClock,
  cilCreditCard,
  cilDescription,
  cilEnvelopeOpen,
  cilList,
  cilNotes,
} from "@coreui/icons";
import { fetchDashboard } from "../../store/slices/dashboardSlice";
import { fetchCategories } from "../../store/slices/categorySlice";
import { fetchProducts } from "../../store/slices/productSlice";
import { fetchOrders } from "../../store/slices/orderSlice";
import { fetchContactMessages } from "../../store/slices/contactMessageSlice";

const getResolvedDarkMode = () => {
  if (typeof document === "undefined") return false;

  const theme = document.documentElement.getAttribute("data-coreui-theme");

  if (theme === "dark") return true;
  if (theme === "light") return false;

  return (
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
};

const pad = (value) => String(value).padStart(2, "0");

const startOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);

const getDayKey = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const getMonthKey = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;

const isValidDate = (value) => {
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
};

const buildRangeSeries = (items = [], range = "Month") => {
  const now = new Date();
  const buckets = [];

  if (range === "Day") {
    for (let i = 6; i >= 0; i -= 1) {
      const current = new Date(now);
      current.setDate(now.getDate() - i);
      const normalized = startOfDay(current);

      buckets.push({
        key: getDayKey(normalized),
        label: normalized.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        }),
      });
    }
  } else if (range === "Month") {
    for (let i = 29; i >= 0; i -= 1) {
      const current = new Date(now);
      current.setDate(now.getDate() - i);
      const normalized = startOfDay(current);

      buckets.push({
        key: getDayKey(normalized),
        label: normalized.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        }),
      });
    }
  } else {
    for (let i = 11; i >= 0; i -= 1) {
      const current = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const normalized = startOfMonth(current);

      buckets.push({
        key: getMonthKey(normalized),
        label: normalized.toLocaleDateString(undefined, {
          month: "short",
        }),
      });
    }
  }

  const counter = buckets.reduce((acc, bucket) => {
    acc[bucket.key] = 0;
    return acc;
  }, {});

  items.forEach((item) => {
    if (!isValidDate(item?.createdAt)) return;

    const date = new Date(item.createdAt);
    const key =
      range === "Year"
        ? getMonthKey(startOfMonth(date))
        : getDayKey(startOfDay(date));

    if (Object.prototype.hasOwnProperty.call(counter, key)) {
      counter[key] += 1;
    }
  });

  return {
    labels: buckets.map((bucket) => bucket.label),
    data: buckets.map((bucket) => counter[bucket.key] || 0),
  };
};

const Dashboard = () => {
  const dispatch = useDispatch();

  const { stats, loading: dashboardLoading } = useSelector(
    (state) => state.dashboard || {},
  );
  const { list: categories = [], loading: categoriesLoading = false } =
    useSelector((state) => state.categories || {});
  const { list: products = [], loading: productsLoading = false } = useSelector(
    (state) => state.products || {},
  );
  const { list: orders = [], loading: ordersLoading = false } = useSelector(
    (state) => state.orders || {},
  );
  const { list: contactMessages = [], loading: messagesLoading = false } =
    useSelector((state) => state.contactMessages || {});

  const [range, setRange] = useState("Month");
  const [isDark, setIsDark] = useState(false);
  const [chartReady, setChartReady] = useState(false);

  useEffect(() => {
    dispatch(fetchDashboard());
    dispatch(fetchCategories());
    dispatch(fetchProducts());
    dispatch(fetchOrders());
    dispatch(fetchContactMessages());
  }, [dispatch]);

  useEffect(() => {
    setIsDark(getResolvedDarkMode());

    if (typeof document === "undefined" || typeof window === "undefined")
      return undefined;

    const observer = new MutationObserver(() => {
      setIsDark(getResolvedDarkMode());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-coreui-theme"],
    });

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = () => setIsDark(getResolvedDarkMode());

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleMediaChange);
    } else {
      mediaQuery.addListener(handleMediaChange);
    }

    return () => {
      observer.disconnect();
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleMediaChange);
      } else {
        mediaQuery.removeListener(handleMediaChange);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    let rafId = null;
    rafId = window.requestAnimationFrame(() => {
      setChartReady(true);
    });

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  const formatCurrency = (value) => `$${Number(value || 0).toFixed(2)}`;

  const getCustomerFullName = (order) => {
    const firstName = order?.customer?.first_name || "";
    const lastName = order?.customer?.last_name || "";
    return `${firstName} ${lastName}`.trim() || "N/A";
  };

  const getOrderStatusBadge = (status) => {
    if (status === "placed") return "primary";
    if (status === "processing") return "warning";
    if (status === "shipped") return "info";
    if (status === "delivered") return "success";
    if (status === "cancelled") return "danger";
    return "secondary";
  };

  const getOrderStatusLabel = (status) => {
    if (status === "placed") return "Placed";
    if (status === "processing") return "Processing";
    if (status === "shipped") return "Shipped";
    if (status === "delivered") return "Delivered";
    if (status === "cancelled") return "Cancelled";
    return "Unknown";
  };

  const getPaymentStatusBadge = (status) => {
    if (status === "pending") return "warning";
    if (status === "paid") return "success";
    if (status === "failed") return "danger";
    return "secondary";
  };

  const getMessageStatusBadge = (status) => {
    if (status === "new") return "danger";
    if (status === "in_progress") return "warning";
    if (status === "resolved") return "success";
    return "secondary";
  };

  const getMessageStatusLabel = (status) => {
    if (status === "in_progress") return "In Progress";
    if (status === "resolved") return "Resolved";
    return "New";
  };

  const dashboardStats = useMemo(() => {
    const totalRevenueFallback = orders
      .filter((item) => item.payment_status === "paid")
      .reduce((sum, item) => sum + Number(item.total || 0), 0);

    return {
      totalCategories:
        stats?.totalCategories ??
        stats?.total_categories ??
        categories.length ??
        0,
      totalProducts:
        stats?.totalProducts ?? stats?.total_products ?? products.length ?? 0,
      activeProducts:
        stats?.activeProducts ??
        stats?.active_products ??
        products.filter((item) => item.is_active).length ??
        0,
      featuredProducts:
        stats?.featuredProducts ??
        stats?.featured_products ??
        products.filter((item) => item.is_featured).length ??
        0,
      lowStockProducts:
        stats?.lowStockProducts ??
        stats?.low_stock_products ??
        products.filter((item) => Number(item.stock || 0) <= 5).length ??
        0,
      totalContentPages:
        stats?.totalContentPages ?? stats?.total_content_pages ?? 0,

      totalOrders:
        stats?.totalOrders ?? stats?.total_orders ?? orders.length ?? 0,
      placedOrders:
        stats?.placedOrders ??
        stats?.placed_orders ??
        orders.filter((item) => item.order_status === "placed").length ??
        0,
      processingOrders:
        stats?.processingOrders ??
        stats?.processing_orders ??
        orders.filter((item) => item.order_status === "processing").length ??
        0,
      shippedOrders:
        stats?.shippedOrders ??
        stats?.shipped_orders ??
        orders.filter((item) => item.order_status === "shipped").length ??
        0,
      deliveredOrders:
        stats?.deliveredOrders ??
        stats?.delivered_orders ??
        orders.filter((item) => item.order_status === "delivered").length ??
        0,
      cancelledOrders:
        stats?.cancelledOrders ??
        stats?.cancelled_orders ??
        orders.filter((item) => item.order_status === "cancelled").length ??
        0,
      paidOrders:
        stats?.paidOrders ??
        stats?.paid_orders ??
        orders.filter((item) => item.payment_status === "paid").length ??
        0,
      pendingPaymentOrders:
        stats?.pendingPaymentOrders ??
        stats?.pending_payment_orders ??
        orders.filter((item) => item.payment_status === "pending").length ??
        0,
      failedPaymentOrders:
        stats?.failedPaymentOrders ??
        stats?.failed_payment_orders ??
        orders.filter((item) => item.payment_status === "failed").length ??
        0,
      codOrders:
        stats?.codOrders ??
        stats?.cod_orders ??
        orders.filter((item) => item.payment_method === "cod").length ??
        0,
      totalRevenue:
        stats?.totalRevenue ?? stats?.total_revenue ?? totalRevenueFallback,
    };
  }, [stats, categories, products, orders]);

  const messageStats = useMemo(() => {
    return {
      totalMessages: contactMessages.length ?? 0,
      totalNewMessages:
        contactMessages.filter((item) => item.status === "new").length ?? 0,
      totalInProgressMessages:
        contactMessages.filter((item) => item.status === "in_progress")
          .length ?? 0,
      totalResolvedMessages:
        contactMessages.filter((item) => item.status === "resolved").length ??
        0,
    };
  }, [contactMessages]);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [orders]);

  const recentProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [products]);

  const recentCategories = useMemo(() => {
    return [...categories]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [categories]);

  const recentContactMessages = useMemo(() => {
    return [...contactMessages]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [contactMessages]);

  const productSeries = useMemo(
    () => buildRangeSeries(products, range),
    [products, range],
  );

  const orderSeries = useMemo(
    () => buildRangeSeries(orders, range),
    [orders, range],
  );

  const chartData = useMemo(() => {
    return {
      labels: productSeries.labels,
      datasets: [
        {
          label: "Products",
          data: productSeries.data,
          borderColor: "#4f46e5",
          backgroundColor: "rgba(79, 70, 229, 0.14)",
          fill: true,
          tension: 0.4,
          borderWidth: 4,
          pointRadius: 4,
          pointHoverRadius: 7,
          pointHitRadius: 32,
          pointBackgroundColor: "#ffffff",
          pointBorderColor: "#4f46e5",
          pointBorderWidth: 2,
          pointHoverBackgroundColor: "#4f46e5",
          pointHoverBorderColor: "#ffffff",
          pointHoverBorderWidth: 3,
          spanGaps: true,
          clip: 12,
        },
        {
          label: "Orders",
          data: orderSeries.data,
          borderColor: "#0ea5e9",
          backgroundColor: "rgba(14, 165, 233, 0.08)",
          fill: false,
          tension: 0.4,
          borderWidth: 4,
          pointRadius: 4,
          pointHoverRadius: 7,
          pointHitRadius: 32,
          pointBackgroundColor: "#ffffff",
          pointBorderColor: "#0ea5e9",
          pointBorderWidth: 2,
          pointHoverBackgroundColor: "#0ea5e9",
          pointHoverBorderColor: "#ffffff",
          pointHoverBorderWidth: 3,
          spanGaps: true,
          clip: 12,
        },
      ],
    };
  }, [productSeries, orderSeries]);

  const axisColor = isDark ? "#94a3b8" : "#64748b";
  const gridColor = isDark
    ? "rgba(148, 163, 184, 0.12)"
    : "rgba(100, 116, 139, 0.14)";

  const chartOptions = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      normalized: true,
      resizeDelay: 120,
      interaction: {
        mode: "index",
        axis: "x",
        intersect: false,
      },
      hover: {
        mode: "index",
        axis: "x",
        intersect: false,
      },
      events: ["mousemove", "mouseout", "click", "touchstart", "touchmove"],
      animation: false,
      transitions: {
        active: {
          animation: {
            duration: 0,
          },
        },
        resize: {
          animation: {
            duration: 0,
          },
        },
      },
      layout: {
        padding: {
          top: 8,
          right: 8,
          bottom: 0,
          left: 4,
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
          labels: {
            color: axisColor,
            usePointStyle: true,
            pointStyle: "circle",
            boxWidth: 10,
            boxHeight: 10,
            padding: 18,
            font: {
              size: 13,
              weight: "600",
            },
          },
        },
        tooltip: {
          enabled: true,
          mode: "index",
          intersect: false,
          position: "nearest",
          displayColors: true,
          usePointStyle: true,
          backgroundColor: "rgba(15, 23, 42, 0.94)",
          titleColor: "#ffffff",
          bodyColor: "#e5e7eb",
          borderColor: "rgba(255,255,255,0.08)",
          borderWidth: 1,
          cornerRadius: 12,
          padding: 14,
          caretPadding: 10,
          boxPadding: 6,
          titleSpacing: 6,
          bodySpacing: 6,
          titleFont: {
            size: 14,
            weight: "700",
          },
          bodyFont: {
            size: 13,
            weight: "600",
          },
          callbacks: {
            title: (items) => items?.[0]?.label || "",
            label: (context) =>
              `${context.dataset.label}: ${context.formattedValue}`,
            labelPointStyle: () => ({
              pointStyle: "rectRounded",
              rotation: 0,
            }),
          },
        },
      },
      elements: {
        line: {
          tension: 0.4,
          borderWidth: 4,
        },
        point: {
          radius: 4,
          hitRadius: 32,
          hoverRadius: 7,
          hoverBorderWidth: 3,
        },
      },
      scales: {
        x: {
          offset: false,
          grid: {
            color: gridColor,
            drawBorder: false,
          },
          ticks: {
            color: axisColor,
            autoSkip: true,
            maxTicksLimit: range === "Month" ? 8 : 12,
            maxRotation: 0,
            font: {
              size: 12,
              weight: "500",
            },
          },
        },
        y: {
          beginAtZero: true,
          grace: 0,
          grid: {
            color: gridColor,
            drawBorder: false,
          },
          ticks: {
            color: axisColor,
            precision: 0,
            font: {
              size: 12,
              weight: "500",
            },
          },
        },
      },
    };
  }, [axisColor, gridColor, range]);

  const periodProductsTotal = productSeries.data.reduce(
    (sum, value) => sum + value,
    0,
  );
  const periodOrdersTotal = orderSeries.data.reduce(
    (sum, value) => sum + value,
    0,
  );

  const isPageLoading =
    dashboardLoading ||
    categoriesLoading ||
    productsLoading ||
    ordersLoading ||
    messagesLoading;

  const primaryCards = [
    {
      title: "Categories",
      value: dashboardStats.totalCategories,
      meta: `${dashboardStats.totalContentPages} content pages`,
      icon: cilList,
      iconClass: "bg-warning-subtle text-warning",
      cardClass: "dashboard-main-kpi-card--warning",
    },
    {
      title: "Products",
      value: dashboardStats.totalProducts,
      meta: `${dashboardStats.activeProducts} active · ${dashboardStats.lowStockProducts} low stock`,
      icon: cilBasket,
      iconClass: "bg-info-subtle text-info",
      cardClass: "dashboard-main-kpi-card--info",
    },
    {
      title: "Orders",
      value: dashboardStats.totalOrders,
      meta: `${dashboardStats.paidOrders} paid · ${dashboardStats.codOrders} COD`,
      icon: cilCart,
      iconClass: "bg-primary-subtle text-primary",
      cardClass: "dashboard-main-kpi-card--primary",
    },
    {
      title: "Revenue",
      value: formatCurrency(dashboardStats.totalRevenue),
      meta: `${dashboardStats.deliveredOrders} delivered orders`,
      icon: cilCreditCard,
      iconClass: "bg-success-subtle text-success",
      cardClass: "dashboard-main-kpi-card--success",
    },
  ];

  const orderBreakdownCards = [
    {
      title: "Placed Orders",
      value: dashboardStats.placedOrders,
      icon: cilDescription,
      iconClass: "bg-primary-subtle text-primary",
    },
    {
      title: "Processing Orders",
      value: dashboardStats.processingOrders,
      icon: cilClock,
      iconClass: "bg-warning-subtle text-warning",
    },
    {
      title: "Shipped Orders",
      value: dashboardStats.shippedOrders,
      icon: cilCart,
      iconClass: "bg-info-subtle text-info",
    },
    {
      title: "Delivered Orders",
      value: dashboardStats.deliveredOrders,
      icon: cilCheckCircle,
      iconClass: "bg-success-subtle text-success",
    },
    {
      title: "Cancelled Orders",
      value: dashboardStats.cancelledOrders,
      icon: cilDescription,
      iconClass: "bg-danger-subtle text-danger",
    },
    {
      title: "Paid Orders",
      value: dashboardStats.paidOrders,
      icon: cilCreditCard,
      iconClass: "bg-success-subtle text-success",
    },
    {
      title: "Pending Payment",
      value: dashboardStats.pendingPaymentOrders,
      icon: cilClock,
      iconClass: "bg-warning-subtle text-warning",
    },
    {
      title: "COD Orders",
      value: dashboardStats.codOrders,
      icon: cilNotes,
      iconClass: "bg-secondary-subtle text-secondary",
    },
  ];

  const messageBreakdownCards = [
    {
      title: "Total Messages",
      value: messageStats.totalMessages,
      icon: cilEnvelopeOpen,
      iconClass: "bg-secondary-subtle text-secondary",
    },
    {
      title: "New Messages",
      value: messageStats.totalNewMessages,
      icon: cilDescription,
      iconClass: "bg-danger-subtle text-danger",
    },
    {
      title: "In Progress",
      value: messageStats.totalInProgressMessages,
      icon: cilClock,
      iconClass: "bg-warning-subtle text-warning",
    },
    {
      title: "Resolved",
      value: messageStats.totalResolvedMessages,
      icon: cilCheckCircle,
      iconClass: "bg-success-subtle text-success",
    },
  ];

  return (
    <>
      <div className="dashboard-page-title-wrap mb-4">
        <h2 className="dashboard-page-title">Dashboard</h2>
        <p className="dashboard-page-subtitle mb-0">
          Premium overview of products, orders, revenue, messages and recent
          activity
        </p>
      </div>

      <CRow className="g-4 mb-4">
        {primaryCards.map((card) => (
          <CCol sm={6} xl={3} key={card.title}>
            <CCard
              className={`dashboard-main-kpi-card border-0 ${card.cardClass}`}
            >
              <CCardBody className="dashboard-main-kpi-card__body">
                <div
                  className={`dashboard-main-kpi-card__icon ${card.iconClass}`}
                >
                  <CIcon icon={card.icon} size="lg" />
                </div>

                <div className="dashboard-main-kpi-card__content">
                  <div className="dashboard-main-kpi-card__label">
                    {card.title}
                  </div>
                  <div className="dashboard-main-kpi-card__value">
                    {card.value}
                  </div>
                  <div className="dashboard-main-kpi-card__meta">
                    {card.meta}
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>

      <CCard className="premium-dashboard-card dashboard-chart-card mb-4 border-0 shadow-sm">
        <CCardHeader className="premium-dashboard-card-header dashboard-chart-card__header">
          <div>
            <div className="fw-bold fs-4">Products & Orders Overview</div>
            <div className="text-medium-emphasis">
              Real DB-based trend view for products and orders
            </div>
          </div>

          <div className="dashboard-range-switch">
            {["Day", "Month", "Year"].map((item) => (
              <button
                key={item}
                type="button"
                className={`dashboard-range-btn ${range === item ? "active" : ""}`}
                onClick={() => setRange(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </CCardHeader>

        <CCardBody className="dashboard-chart-card__body">
          <div className="dashboard-chart-meta mb-3">
            <div className="dashboard-chart-meta__item">
              <span className="dashboard-chart-meta__dot dashboard-chart-meta__dot--product" />
              <div>
                <strong>{periodProductsTotal}</strong>
                <small>Products in selected range</small>
              </div>
            </div>

            <div className="dashboard-chart-meta__item">
              <span className="dashboard-chart-meta__dot dashboard-chart-meta__dot--order" />
              <div>
                <strong>{periodOrdersTotal}</strong>
                <small>Orders in selected range</small>
              </div>
            </div>
          </div>

          <div className="dashboard-chart-stage">
            <div className="dashboard-chart-wrap">
              <div className="dashboard-chart-inner">
                {chartReady ? (
                  // <CChartLine redraw={false} data={chartData} options={chartOptions} />
                  <CChartLine
                    customTooltips={false}
                    redraw
                    data={chartData}
                    options={chartOptions}
                  />
                ) : (
                  <div className="dashboard-chart-loader">
                    <CSpinner size="sm" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </CCardBody>
      </CCard>

      <div className="dashboard-section-heading">Orders Breakdown</div>
      <CRow className="g-3 mb-4">
        {orderBreakdownCards.map((card) => (
          <CCol xs={12} sm={6} xl={3} key={card.title}>
            <CCard className="dashboard-breakdown-card border-0 shadow-sm h-100">
              <CCardBody className="dashboard-breakdown-card__body">
                <div
                  className={`dashboard-breakdown-card__icon ${card.iconClass}`}
                >
                  <CIcon icon={card.icon} />
                </div>
                <div className="dashboard-breakdown-card__content">
                  <div className="dashboard-breakdown-card__label">
                    {card.title}
                  </div>
                  <div className="dashboard-breakdown-card__value">
                    {card.value}
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>

      <div className="dashboard-section-heading">Contact Messages</div>
      <CRow className="g-3 mb-4">
        {messageBreakdownCards.map((card) => (
          <CCol xs={12} sm={6} xl={3} key={card.title}>
            <CCard className="dashboard-breakdown-card border-0 shadow-sm h-100">
              <CCardBody className="dashboard-breakdown-card__body">
                <div
                  className={`dashboard-breakdown-card__icon ${card.iconClass}`}
                >
                  <CIcon icon={card.icon} />
                </div>
                <div className="dashboard-breakdown-card__content">
                  <div className="dashboard-breakdown-card__label">
                    {card.title}
                  </div>
                  <div className="dashboard-breakdown-card__value">
                    {card.value}
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>

      <CRow className="g-4">
        <CCol lg={6}>
          <CCard className="premium-dashboard-card border-0 shadow-sm h-100">
            <CCardHeader className="premium-dashboard-card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div className="d-flex align-items-center">
                <CIcon icon={cilCart} className="me-2" />
                <strong>Recent Orders</strong>
              </div>

              <Link
                to="/admin/orders"
                className="btn btn-sm btn-outline-primary premium-dashboard-link-btn"
              >
                View All
              </Link>
            </CCardHeader>

            <CCardBody>
              <CTable hover responsive className="dashboard-mini-table">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Order</CTableHeaderCell>
                    <CTableHeaderCell>Customer</CTableHeaderCell>
                    <CTableHeaderCell>Total</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {recentOrders.length ? (
                    recentOrders.map((item) => (
                      <CTableRow key={item._id}>
                        <CTableDataCell>
                          <div className="fw-semibold">{item.order_number}</div>
                          <small className="text-medium-emphasis">
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleDateString()
                              : "-"}
                          </small>
                        </CTableDataCell>

                        <CTableDataCell>
                          <div className="fw-semibold">
                            {getCustomerFullName(item)}
                          </div>
                          <small className="text-medium-emphasis">
                            {item.customer?.email || "-"}
                          </small>
                        </CTableDataCell>

                        <CTableDataCell>
                          <div className="fw-semibold">
                            {formatCurrency(item.total)}
                          </div>
                          <small className="text-medium-emphasis">
                            {item.total_items || 0} item(s)
                          </small>
                        </CTableDataCell>

                        <CTableDataCell>
                          <div className="d-flex flex-column gap-1">
                            <CBadge
                              color={getOrderStatusBadge(item.order_status)}
                            >
                              {getOrderStatusLabel(item.order_status)}
                            </CBadge>
                            <CBadge
                              color={getPaymentStatusBadge(item.payment_status)}
                            >
                              {item.payment_status || "pending"}
                            </CBadge>
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={4} className="text-center">
                        {isPageLoading ? "Loading..." : "No orders found"}
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol lg={6}>
          <CCard className="premium-dashboard-card border-0 shadow-sm h-100">
            <CCardHeader className="premium-dashboard-card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div className="d-flex align-items-center">
                <CIcon icon={cilBasket} className="me-2" />
                <strong>Recent Products</strong>
              </div>

              <Link
                to="/admin/products"
                className="btn btn-sm btn-outline-primary premium-dashboard-link-btn"
              >
                View All
              </Link>
            </CCardHeader>

            <CCardBody>
              <CTable hover responsive className="dashboard-mini-table">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Title</CTableHeaderCell>
                    <CTableHeaderCell>Price</CTableHeaderCell>
                    <CTableHeaderCell>Stock</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {recentProducts.length ? (
                    recentProducts.map((item) => (
                      <CTableRow key={item._id}>
                        <CTableDataCell>
                          <div className="fw-semibold">{item.title}</div>
                          <small className="text-medium-emphasis">
                            {item.category_id?.name || "-"}
                          </small>
                        </CTableDataCell>
                        <CTableDataCell>
                          {formatCurrency(item.price)}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge
                            color={
                              Number(item.stock || 0) > 10
                                ? "success"
                                : Number(item.stock || 0) > 0
                                  ? "warning"
                                  : "danger"
                            }
                          >
                            {item.stock || 0}
                          </CBadge>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={3} className="text-center">
                        {isPageLoading ? "Loading..." : "No products found"}
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol lg={6}>
          <CCard className="premium-dashboard-card border-0 shadow-sm h-100">
            <CCardHeader className="premium-dashboard-card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div className="d-flex align-items-center">
                <CIcon icon={cilList} className="me-2" />
                <strong>Recent Categories</strong>
              </div>

              <Link
                to="/admin/categories"
                className="btn btn-sm btn-outline-primary premium-dashboard-link-btn"
              >
                View All
              </Link>
            </CCardHeader>

            <CCardBody>
              <CTable hover responsive className="dashboard-mini-table">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>Section</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {recentCategories.length ? (
                    recentCategories.map((item) => (
                      <CTableRow key={item._id}>
                        <CTableDataCell>
                          <div className="fw-semibold">{item.name}</div>
                          <small className="text-medium-emphasis">
                            {item.slug}
                          </small>
                        </CTableDataCell>

                        <CTableDataCell>
                          <CBadge
                            color={
                              item.menu_section === "retail"
                                ? "info"
                                : "warning"
                            }
                          >
                            {item.menu_section}
                          </CBadge>
                        </CTableDataCell>

                        <CTableDataCell>
                          <CBadge
                            color={item.is_active ? "success" : "secondary"}
                          >
                            {item.is_active ? "Active" : "Inactive"}
                          </CBadge>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={3} className="text-center">
                        {isPageLoading ? "Loading..." : "No categories found"}
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol lg={6}>
          <CCard className="premium-dashboard-card border-0 shadow-sm h-100">
            <CCardHeader className="premium-dashboard-card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div className="d-flex align-items-center">
                <CIcon icon={cilEnvelopeOpen} className="me-2" />
                <strong>Recent Contact Messages</strong>
              </div>

              <Link
                to="/admin/contact-messages"
                className="btn btn-sm btn-outline-primary premium-dashboard-link-btn"
              >
                View All
              </Link>
            </CCardHeader>

            <CCardBody>
              <CTable hover responsive className="dashboard-mini-table">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>Email</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {recentContactMessages.length ? (
                    recentContactMessages.map((item) => (
                      <CTableRow key={item._id}>
                        <CTableDataCell>
                          <div className="fw-semibold">{item.full_name}</div>
                          <small className="text-medium-emphasis">
                            {item.phone || "-"}
                          </small>
                        </CTableDataCell>

                        <CTableDataCell>{item.email}</CTableDataCell>

                        <CTableDataCell>
                          <CBadge color={getMessageStatusBadge(item.status)}>
                            {getMessageStatusLabel(item.status)}
                          </CBadge>
                        </CTableDataCell>

                        <CTableDataCell>
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleString()
                            : "-"}
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={4} className="text-center">
                        {isPageLoading
                          ? "Loading..."
                          : "No contact messages found"}
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default Dashboard;
