import React, { useState, useEffect, useRef } from "react";
// import {  useLocation } from "react-router-dom";
import { useParams, useLocation } from "react-router-dom";
import Loader from "../../components/loader/Loader"; // Import Loader component
import API from "../../http/api";
import gsap from "gsap";
import { toast } from "react-toastify";
import Confetti from "react-confetti";
import { confirmAction } from "../../constants/functions";

const CampaigningSpin = () => {
  const { id } = useParams();
  const location = useLocation();
  const totalPrize = location.state?.totalPrize || 0;
  const [loading, setLoading] = useState(true);
  const [Data, setData] = useState([]);
  const [winnersList, setWinnersList] = useState([]);
  const [campaigning, setCampaigning] = useState([]);
  const animationRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isWinnerReady, setIsWinnerReady] = useState(false);
  const [campaignStatus, setCampaignStatus] = useState("active");
  const divRef = useRef(null);

  useEffect(() => {
    if (id) {
      fetchList();
      getWinnersList();
      getCampaignDetails();
    }
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [id]);

  const handleWinners = async (id) => {
    try {
      setLoading(true);

      const response = await API.post(`delete-winner`, { winner_id: id });

      if (response?.status === 200) {
        getWinnersList();
        toast.success(response?.message);
      } else {
        toast.error(response?.message || "Failed to fetch winner data.");
      }
    } catch (error) {
      toast.error(
        error?.message || "Something went wrong while fetching the winner data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Data.length > 1) {
      animationRef.current = verticalLoop(".campaign-participent-item", 500);
      animationRef.current.pause();
      // if (animationRef.current) animationRef.current.pause();
    }
  }, [Data]);

  useEffect(() => {
    if (divRef.current) {
      setDimensions({
        width: divRef.current.offsetWidth,
        height: divRef.current.offsetHeight,
      });
    }
  }, []);

  const fetchList = async () => {
    try {
      setLoading(true);
      setData([]);

      let allCoupons = [];
      let currentPage = 1;
      let totalPages = 1;

      while (currentPage <= totalPages) {
        // const { id } = useParams(); // campaign id from URL
        // console.log("Campaign ID from params:", id); // debug

        const response = await API.post("participants-list", {             
          campaign_id: id,
          page: currentPage,
        });

        if (response?.status === 200) {

          const { coupons, pagination } = response.data;
          allCoupons = [...allCoupons, ...coupons];

          totalPages = pagination.total_pages;
          currentPage++;
        } else {
          toast.error(response?.message || "Failed to fetch  participants.");
          break;
        }
      }
      setData(allCoupons);
    } catch (error) {
      toast.error(
        error?.message || "Something went wrong while fetching campaign data."
      );
    } finally {
      setLoading(false);
    }
  };

  const getWinnersList = async () => {
    try {
      setLoading(true);

      const response = await API.post("winner-list", {
        campaign_id: id,
      });

      if (response?.status === 200) {
        setWinnersList(response?.data || []);

      }
    } catch (error) {
      toast.error(
        error?.message || "Something went wrong while fetching winners data."
      );
    } finally {
      setLoading(false);
    }
  };

  const getCampaignDetails = async () => {
  try {
    const response = await API.get(`campaign-view/${id}`);
    
    console.log("Campaign Data:", response.data); 

    if (response?.status === 200) {
      setCampaignStatus(response.data?.data?.status || "active");
    }
  } catch (err) {
    console.log(err);
  }
};


  const verticalLoop = (elements, speed) => {
    elements = gsap.utils.toArray(elements);
    const firstBounds = elements[0].getBoundingClientRect();
    const lastBounds = elements[elements.length - 1].getBoundingClientRect();
    const top =
      firstBounds.top -
      firstBounds.height -
      Math.abs(elements[1].getBoundingClientRect().top - firstBounds.bottom);
    const bottom = lastBounds.top;
    const distance = bottom - top;
    const duration = Math.abs(distance / speed);
    const tl = gsap.timeline({ repeat: -1 });
    const plus = speed < 0 ? "-=" : "+=";
    const minus = speed < 0 ? "+=" : "-=";

    elements.forEach((el) => {
      const bounds = el.getBoundingClientRect();
      let ratio = Math.abs((bottom - bounds.top) / distance);
      if (speed < 0) {
        ratio = 1 - ratio;
      }
      tl.to(
        el,
        {
          y: plus + distance * ratio,
          duration: duration * ratio,
          ease: "none",
        },
        0
      );
      tl.fromTo(
        el,
        { y: minus + distance },
        {
          y: plus + (1 - ratio) * distance,
          ease: "none",
          duration: (1 - ratio) * duration,
          immediateRender: false,
        },
        duration * ratio
      );
    });
    return tl;
  };

  const handleStop = async () => {
    try {
      setLoading(true);
      const response = await API.post(`select-winner`, { campaign_id: id });
      if (response?.status === 200) {
        setIsPlaying(false);
        animationRef.current?.pause();

        setIsWinnerReady(true);

        // const targetCouponId = response?.[0]?.coupon_id || response?.[0]?.couponId;
        const targetCouponId = response?.coupon_id;

        const items = document.querySelectorAll(".campaign-participent-item");

        items.forEach((item) => {
          const couponId = parseInt(item.getAttribute("data-coupon-id"), 10);

          if (couponId === targetCouponId) {
            item.classList.add("active");

            const container = document.querySelector(
              ".campaign-participent-list"
            );
            const containerRect = container.getBoundingClientRect();
            const itemRect = item.getBoundingClientRect();

            const offset =
              itemRect.top -
              containerRect.top -
              containerRect.height / 2 +
              itemRect.height / 2;

            gsap.to(container, {
              scrollTop: container.scrollTop + offset,
              duration: 1,
              ease: "power2.out",
            });

            setTimeout(async () => {
              const response2 = await API.post(`pick-winner`, {
                campaign_id: id,
                coupon_id: targetCouponId,
              });

              setIsWinnerReady(false);

              if (response2?.status === 200) {
                toast.success("Winner selected successfully!");
                await getWinnersList();
  await fetchList();

  setIsPlaying(false);


              } else {
                toast.error(response2?.message || "Failed to pick winner.");
              }
            }, 5000);
          } else {
            item.classList.remove("active");
          }
        });
      } else {
        toast.error(response?.message || "Failed to select winner.");
      }
    }
    catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong while selecting winner.";

      toast.error(msg);
    }

    finally {
      setLoading(false);
    }
  };

  const handleStart = () => {
    if (Data?.length > 1) {
      setIsPlaying(true);
      animationRef.current.play();
    }

    setTimeout(() => {
      handleStop();
    }, 5000);
  };

  const handleClose = async () => {
    try {
      setLoading(true);

      const response = await API.post("close-campaign", {
        campaign_id: id,
      });

      if (response?.status === 200) {
        toast.success("Campaign closed");
        setCampaignStatus("closed");
      } else {
        toast.error(response?.message);
      }

    } catch (error) {
      toast.error("Error closing campaign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content app-content">
      <div className="container-fluid">
        <div className="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
          <h1 className="page-title fw-semibold fs-18 mb-0">
            {/* {campaignData.name} */}
          </h1>
        </div>

        <div className="row">
          <div className="col-xl-12">
            <div className="card custom-card">
              <div className="col-xl-12">
                <div className="card custom-card">
                  <div className="card-header justify-content-between">
                    <div className="card-title">Weekly Campaign</div>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div ref={divRef} className="col-xl-3">
                        {isWinnerReady && (
                          <Confetti
                            width={dimensions.width}
                            height={dimensions.height}
                            numberOfPieces={300}
                          />
                        )}
                        <div className="campaign-participent-list">
                          {Data &&
                            Data?.map((item, i) => (
                              <div
                                key={item?.coupon_id}
                                className="campaign-participent-item"
                                data-coupon-id={item?.coupon_id}
                              >
                                <div className="campaign-participent-name">
                                  {item?.customer?.first_name || "-"}{" "}
                                  {item?.customer?.last_name}
                                </div>
                                <span className="campaign-participent-coupon-number">
                                  {item?.coupon_code}
                                </span>
                              </div>
                            ))}
                        </div>

                        {campaignStatus !== "closed" &&
                          winnersList.length < totalPrize && (
                            <button
                              type="button"
                              className="campaign-btn mb-2"
                              onClick={handleStart}
                              disabled={isPlaying || loading}
                            >
                              START CAMPAIGN
                            </button>
                          )}
                        {campaignStatus !== "closed" &&
                          winnersList.length >= totalPrize && (
                            <button
                              type="button"
                              className="campaign-btn2"
                              onClick={handleClose}
                              disabled={isPlaying || loading}
                            >
                              CLOSE CAMPAIGN
                            </button>
                          )}
                      </div>
                      <div className="col-xl-9">
                        <div className="campaign-winners">
                          <div className="table-responsive">
                            <table className="table">
                              <thead>
                                <tr>
                                  <th className="text-center" colSpan={4}>
                                    WINNERS
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {winnersList?.length > 0 &&
                                  winnersList?.map((item, idx) => (
                                    <tr>
                                      <td>{idx + 1}</td>
                                      <td>
                                        <span className="d-block">
                                          {" "}
                                          {item?.customer?.first_name ||
                                            "-"}{" "}
                                          {item?.customer?.last_name}
                                        </span>
                                        {item?.coupon_code}
                                      </td>
                                      <td>{item?.prize?.name}</td>
                                      <td>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            confirmAction(
                                              item?.winner_id,
                                              handleWinners
                                            )
                                          }
                                          className="btn btn-icon waves-effect waves-light btn-sm btn-danger-light"
                                          title="Delete"
                                        >
                                          <i className="ri-delete-bin-line" />
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>

                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaigningSpin;
