'use client'
import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";

import "./styles.css";

export default function Home() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  function handleSearch(e) {
    setSearch(e.target.value);
    setCurrentPage(0);
  }

  function handleSort(field) {
    if (sortField === field) {
      // If the current sort field is clicked again, reverse the sort direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // If a new sort field is clicked, sort in ascending order
      setSortField(field);
      setSortDirection('asc');
    }
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      customer.location.toLowerCase().includes(search.toLowerCase())
  );

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (a[sortField] < b[sortField]) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (a[sortField] > b[sortField]) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const PER_PAGE = 20;
  const offset = currentPage * PER_PAGE;
  const pageCount = Math.ceil(filteredCustomers.length / PER_PAGE);

  return (
    <div className="App">
      <input
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="Search..."
      />
      <table>
        <thead>
          <tr>
            <th>Sno</th>
            <th>Customer Name</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Location</th>
            <th onClick={() => handleSort("date")}>Date</th>
            <th onClick={() => handleSort("time")}>Time</th>
          </tr>
        </thead>
        <tbody>
          {sortedCustomers
            .slice(offset, offset + PER_PAGE)
            .map((customer) => {
              const date = new Date(customer.created_at);
              const dateString = date.toLocaleDateString();
              const timeString = date.toLocaleTimeString();

              // Add date and time to the customer object
              customer.date = dateString;
              customer.time = timeString;

              return (
                <tr key={customer.sno}>
                  <td>{customer.sno}</td>
                  <td>{customer.customer_name}</td>
                  <td>{customer.age}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.location}</td>
                  <td>{dateString}</td>
                  <td>{timeString}</td>
                </tr>
              );
            })}
        </tbody>
      </table>

      <ReactPaginate
        previousLabel={"← Previous"}
        nextLabel={"Next →"}
        pageCount={pageCount}
        onPageChange={({ selected }) => setCurrentPage(selected)}
        containerClassName={"pagination"}
        pageLinkClassName={"pagination__link"}
        previousLinkClassName={"pagination__link"}
        nextLinkClassName={"pagination__link"}
        disabledLinkClassName={"pagination__link--disabled"}
        activeLinkClassName={"pagination__link--active"}
        breakLabel={null}
        breakClassName={"pagination__link"}
        pageClassName={"pagination__item"}
        previousClassName={"pagination__item"}
        nextClassName={"pagination__item"}
        disabledClassName={"pagination__item--disabled"}
        activeClassName={"pagination__item--active"}
        renderPageLink={(pageLinkProps) => (
          <a
            {...pageLinkProps}
            aria-label={`Go to page ${pageLinkProps.page + 1}`}
          />
        )}
        renderBreakLink={(breakLinkProps) => (
          <a {...breakLinkProps} aria-label={breakLinkProps.page} />
        )}
      />
    </div>
  );
}
