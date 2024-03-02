'use client'
import React, { useState, useEffect } from "react";


import "./styles.css";
import ReactPaginate from "react-paginate";

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

  function handleSort(e) {
    const field = e.target.value;
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {

      setSortField(field);
      setSortDirection('asc');
    }
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      customer.location.toLowerCase().includes(search.toLowerCase())
  );

  
// Inside the sortedCustomers declaration
const sortedCustomers = [...filteredCustomers].sort((a, b) => {
  if (sortField === 'date') {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
  } else if (sortField === 'time') {
    const timeA = new Date(`1000-01-01 ${a.time}`);
    const timeB = new Date(`1000-01-01 ${b.time}`);
    return sortDirection === 'asc' ? timeA - timeB : timeB - timeA;
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
      <p>Sort by:{" "}
      <select onChange={handleSort}>  
          <option value="">Select </option>
          <option value="date">Date</option>
          <option value="time">Time</option>
        </select>
      </p>
      <table>
      
        <thead>
          <tr>
            <th>Sno</th>
            <th>Customer Name</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Location</th>
            <th >Date</th>
            <th >Time</th>
          </tr>
        </thead>
        <tbody>
          {sortedCustomers
            .slice(offset, offset + PER_PAGE)
            .map((customer) => {
              const date = new Date(customer.created_at);
              const dateString = date.toLocaleDateString();
              const timeString = date.toLocaleTimeString();
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


